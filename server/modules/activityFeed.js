class ActivityFeed {
  constructor(maxItems = 150) {
    this.maxItems = maxItems;
    this.items = [];
  }

  push(item) {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      ...item
    };

    this.items.unshift(entry);
    if (this.items.length > this.maxItems) {
      this.items.pop();
    }

    return entry;
  }

  list(limit = 40) {
    return this.items.slice(0, limit);
  }
}

module.exports = ActivityFeed;
