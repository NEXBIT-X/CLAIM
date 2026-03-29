class LockService {
  constructor() {
    this.locks = new Map();
    this.duels = new Map();
  }

  getLock(filePath) {
    return this.locks.get(filePath) || null;
  }

  acquire(filePath, ownerId) {
    const current = this.locks.get(filePath);
    if (!current || current.ownerId === ownerId) {
      this.locks.set(filePath, {
        filePath,
        ownerId,
        acquiredAt: Date.now(),
        updatedAt: Date.now()
      });
      return { ok: true, lock: this.locks.get(filePath) };
    }

    return { ok: false, lock: current };
  }

  touch(filePath, ownerId) {
    const current = this.locks.get(filePath);
    if (!current || current.ownerId !== ownerId) {
      return false;
    }
    current.updatedAt = Date.now();
    return true;
  }

  release(filePath, ownerId) {
    const current = this.locks.get(filePath);
    if (current && (!ownerId || current.ownerId === ownerId)) {
      this.locks.delete(filePath);
      return true;
    }
    return false;
  }

  releaseByOwner(ownerId) {
    const released = [];
    for (const [filePath, lock] of this.locks.entries()) {
      if (lock.ownerId === ownerId) {
        this.locks.delete(filePath);
        released.push(filePath);
      }
    }
    return released;
  }

  createDuel(payload) {
    const duelId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const duel = {
      duelId,
      filePath: payload.filePath,
      ownerSocketId: payload.ownerSocketId,
      challengerSocketId: payload.challengerSocketId,
      ownerContent: payload.ownerContent,
      challengerContent: payload.challengerContent,
      baseContent: payload.baseContent,
      votes: new Map(),
      frozenAt: Date.now(),
      resolved: false
    };

    this.duels.set(duelId, duel);
    return duel;
  }

  getDuel(duelId) {
    return this.duels.get(duelId) || null;
  }

  vote(duelId, voterId, side) {
    const duel = this.duels.get(duelId);
    if (!duel || duel.resolved) {
      return null;
    }

    duel.votes.set(voterId, side);

    let ownerVotes = 0;
    let challengerVotes = 0;
    for (const value of duel.votes.values()) {
      if (value === 'owner') {
        ownerVotes += 1;
      }
      if (value === 'challenger') {
        challengerVotes += 1;
      }
    }

    return {
      duel,
      ownerVotes,
      challengerVotes,
      totalVotes: duel.votes.size
    };
  }

  resolve(duelId, winner) {
    const duel = this.duels.get(duelId);
    if (!duel) {
      return null;
    }

    duel.resolved = true;
    duel.winner = winner;
    duel.resolvedAt = Date.now();
    this.duels.delete(duelId);
    return duel;
  }

  hasFrozenFile(filePath) {
    for (const duel of this.duels.values()) {
      if (duel.filePath === filePath && !duel.resolved) {
        return true;
      }
    }
    return false;
  }
}

module.exports = LockService;
