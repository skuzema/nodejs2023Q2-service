import { Injectable } from '@nestjs/common';
import { InMemoryDBV1Entity } from '@nestjs-addons/in-memory-db';
import { v4 } from 'uuid';

@Injectable()
export class DatabaseService<T extends InMemoryDBV1Entity> {
  private readonly db: T[] = [];

  create(item: T): T {
    const newItem = { ...item, id: this.generateId() };
    this.db.push(newItem);
    return newItem;
  }

  findAll(): T[] {
    return this.db;
  }

  findById(id: string): T {
    return this.db.find((item) => String(item.id) === id);
  }

  update(updatedItem: T): T {
    const index = this.db.findIndex((item) => item.id === updatedItem.id);
    if (index === -1) {
      throw new Error('Item not found');
    }
    this.db[index] = updatedItem;
    return updatedItem;
  }

  delete(id: string): void {
    const index = this.db.findIndex((item) => String(item.id) === id);
    if (index !== -1) {
      this.db.splice(index, 1);
    }
  }

  private generateId(): string {
    return v4();
  }
}
