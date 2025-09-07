import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

interface CartItem {
    idProduct: string;
    urlAvatar: string;
    nameProduct: string;
    price: number;
    quantity: number;
}

@Injectable()
export class RedisService {
    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) { }

    async getCart(userId: string): Promise<CartItem[]> {
        const cartKey = `cart:${userId}`;
        return (await this.cache.get(cartKey)) || [];
    }

    async addToCart(
        userId: string,
        productId: string,
        productData: {
            urlAvatar: string;
            nameProduct: string;
            price: number;
        },
        quantity: number
    ): Promise<void> {
        const cartKey = `cart:${userId}`;

        // Lấy giỏ hàng hiện tại hoặc mảng rỗng
        const currentCart: CartItem[] = (await this.cache.get(cartKey)) || [];

        // Kiểm tra sản phẩm đã có trong giỏ chưa
        const existingProductIndex = currentCart.findIndex(
            item => item.idProduct === productId
        );

        if (existingProductIndex !== -1) {
            // Nếu đã có → cập nhật số lượng
            currentCart[existingProductIndex].quantity += quantity;
        } else {
            // Nếu chưa có → thêm sản phẩm mới
            currentCart.push({
                idProduct: productId,
                urlAvatar: productData.urlAvatar,
                nameProduct: productData.nameProduct,
                price: productData.price,
                quantity: quantity
            });
        }

        // Lưu giỏ hàng mới vào Redis
        await this.cache.set(cartKey, currentCart, 30 * 24 * 3600); // 30 days
    }

    async updateCartItemQuantity(
        userId: string,
        productId: string,
        newQuantity: number
    ): Promise<void> {
        const cartKey = `cart:${userId}`;
        const currentCart: CartItem[] = (await this.cache.get(cartKey)) || [];

        const productIndex = currentCart.findIndex(
            item => item.idProduct === productId
        );

        if (productIndex !== -1) {
            if (newQuantity <= 0) {
                // Xóa sản phẩm nếu quantity <= 0
                currentCart.splice(productIndex, 1);
            } else {
                // Cập nhật số lượng
                currentCart[productIndex].quantity = newQuantity;
            }

            await this.cache.set(cartKey, currentCart, 30 * 24 * 3600);
        }
    }

    async removeFromCart(userId: string, productId: string): Promise<void> {
        const cartKey = `cart:${userId}`;
        const currentCart: CartItem[] = (await this.cache.get(cartKey)) || [];

        const filteredCart = currentCart.filter(
            item => item.idProduct !== productId
        );

        await this.cache.set(cartKey, filteredCart, 30 * 24 * 3600);
    }

    async clearCart(userId: string): Promise<void> {
        const cartKey = `cart:${userId}`;
        await this.cache.del(cartKey);
    }

}