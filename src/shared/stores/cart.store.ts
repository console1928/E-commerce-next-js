'use client'

import { makeAutoObservable } from 'mobx'
import { ProductType } from './products.store'

export interface CartItem {
    product: ProductType;
    quantity: number;
}

class CartStore {
    items: CartItem[] = [];
    isOpen: boolean = false;

    constructor() {
        makeAutoObservable(this);
        this.loadFromLocalStorage();
    }

    addToCart = (product: ProductType) => {
        const existingItem = this.items.find(item => item.product.documentId === product.documentId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ product, quantity: 1 });
        }

        this.saveToLocalStorage();
    };

    removeFromCart = (productId: number) => {
        this.items = this.items.filter(item => item.product.documentId !== productId);
        this.saveToLocalStorage();
    };

    updateQuantity = (productId: number, quantity: number) => {
        const item = this.items.find(item => item.product.documentId === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveToLocalStorage();
            }
        }
    };

    clearCart = () => {
        this.items = [];
        this.saveToLocalStorage();
    };

    get totalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    get totalPrice() {
        return this.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    toggleCart = () => {
        this.isOpen = !this.isOpen;
    };

    closeCart = () => {
        this.isOpen = false;
    };

    private saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    private loadFromLocalStorage() {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                this.items = JSON.parse(savedCart);
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            this.items = [];
        }
    }
}

export const cartStore = new CartStore();