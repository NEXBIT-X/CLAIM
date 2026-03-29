const os = require('os');
const mdns = require('multicast-dns');

const VIRTUAL_INTERFACE_HINTS = [
  'vethernet',
  'hyper-v',
  'virtual',
  'vmware',
  'vbox',
  'loopback',
  'docker',
  'wsl',
  'zerotier',
  'tailscale',
  'hamachi',
  'bridge'
];

const PREFERRED_INTERFACE_HINTS = ['wi-fi', 'wifi', 'wlan', 'ethernet'];

function isPrivateIPv4(address) {
  return (
    address.startsWith('10.') ||
    address.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(address)
  );
}

function scoreInterfaceAddress(interfaceName, addressInfo) {
  const name = `${interfaceName || ''}`.toLowerCase();
  const address = `${addressInfo?.address || ''}`;

  if (addressInfo?.internal || addressInfo?.family !== 'IPv4') {
    return -1000;
  }

  if (!address || address.startsWith('127.') || address.startsWith('169.254.')) {
    return -500;
  }

  let score = 0;

  if (isPrivateIPv4(address)) {
    score += 30;
  }

  if (PREFERRED_INTERFACE_HINTS.some((hint) => name.includes(hint))) {
    score += 25;
  }

  if (VIRTUAL_INTERFACE_HINTS.some((hint) => name.includes(hint))) {
    score -= 80;
  }

  if (address.startsWith('192.168.') || address.startsWith('10.')) {
    score += 15;
  }

  return score;
}

function getLanIp() {
  const explicitHost = `${process.env.LAN_SYNC_HOST || ''}`.trim();
  if (explicitHost) {
    return explicitHost;
  }

  const interfaces = os.networkInterfaces();
  let bestAddress = null;
  let bestScore = -Infinity;

  for (const [interfaceName, values] of Object.entries(interfaces)) {
    for (const value of values || []) {
      const score = scoreInterfaceAddress(interfaceName, value);
      if (score > bestScore) {
        bestScore = score;
        bestAddress = value.address;
      }
    }
  }

  return bestAddress || '127.0.0.1';
}

function createMdnsService({ port }) {
  const mdnsInstance = mdns();
  const serviceType = '_lan-sync._tcp.local';
  const machineName = `${os.hostname() || 'host'}`.replace(/[^a-zA-Z0-9-]/g, '-');
  const serviceInstance = `LAN-Sync-${machineName}._lan-sync._tcp.local`;
  const hostName = `${machineName.toLowerCase()}.local`;
  const localIp = getLanIp();
  const discovered = new Map();

  const registerAnswer = () => {
    mdnsInstance.respond({
      answers: [
        { name: serviceType, type: 'PTR', ttl: 120, data: serviceInstance },
        { name: serviceInstance, type: 'SRV', ttl: 120, data: { port, target: hostName, priority: 0, weight: 0 } },
        { name: serviceInstance, type: 'TXT', ttl: 120, data: ['name=LAN-Sync', 'version=1'] },
        { name: hostName, type: 'A', ttl: 120, data: localIp }
      ]
    });
  };

  mdnsInstance.on('query', (query) => {
    const requestedNames = query.questions.map((question) => `${question.name}`.toLowerCase());
    if (
      requestedNames.includes(serviceType.toLowerCase()) ||
      requestedNames.includes(hostName.toLowerCase()) ||
      requestedNames.includes(serviceInstance.toLowerCase())
    ) {
      registerAnswer();
    }
  });

  mdnsInstance.on('response', (response) => {
    const records = [...response.answers, ...response.additionals];
    const addressesByHost = new Map();
    const serviceRecords = [];

    for (const record of records) {
      if (record.type === 'A' && record.name) {
        addressesByHost.set(`${record.name}`.toLowerCase(), record.data);
      }
      if (record.type === 'SRV' && `${record.name}`.includes('._lan-sync._tcp.local')) {
        serviceRecords.push(record);
      }
    }

    for (const serviceRecord of serviceRecords) {
      const target = `${serviceRecord.data?.target || ''}`.toLowerCase();
      const address = addressesByHost.get(target);

      if (!address) {
        continue;
      }

      discovered.set(serviceRecord.name, {
        id: serviceRecord.name,
        name: serviceRecord.name.replace('._lan-sync._tcp.local', ''),
        address,
        port: serviceRecord.data.port,
        host: serviceRecord.data.target,
        isSelf: address === localIp && serviceRecord.data.port === port,
        lastSeen: Date.now()
      });
    }
  });

  const discoveryTimer = setInterval(() => {
    mdnsInstance.query([{ name: serviceType, type: 'PTR' }, { name: hostName, type: 'A' }]);
  }, 3500);

  const heartbeatTimer = setInterval(() => {
    registerAnswer();
  }, 5000);

  registerAnswer();

  return {
    getSessions() {
      const maxAgeMs = 15000;
      const now = Date.now();
      const sessions = [];
      for (const [id, record] of discovered.entries()) {
        if (now - record.lastSeen > maxAgeMs) {
          discovered.delete(id);
          continue;
        }
        sessions.push(record);
      }

      if (!sessions.some((item) => item.isSelf)) {
        sessions.push({
          id: serviceInstance,
          name: `LAN-Sync-${os.hostname()}`,
          address: localIp,
          port,
          host: hostName,
          isSelf: true,
          lastSeen: now
        });
      }

      return sessions;
    },
    close() {
      clearInterval(discoveryTimer);
      clearInterval(heartbeatTimer);
      mdnsInstance.destroy();
    }
  };
}

module.exports = { createMdnsService, getLanIp };
