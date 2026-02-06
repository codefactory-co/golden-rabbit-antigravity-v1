import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductForm from './ProductForm';

// Mock Server Action
vi.mock('../actions', () => ({
    createProductAction: vi.fn(),
}));

// Mock useRouter
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        back: vi.fn(),
        push: vi.fn(),
    }),
}));

// Mock ImageUploader since it uses URL.createObjectURL which might not be available in JSDOM environment without polyfill, or just to simplify
vi.mock('./ImageUploader', () => ({
    default: ({ images, onImagesChange }: { images: File[], onImagesChange: any }) => (
        <div data-testid="image-uploader">
            Image Uploader (Count: {images.length})
        </div>
    ),
}));

describe('ProductForm', () => {
    it('should render all form fields', () => {
        render(<ProductForm />);

        expect(screen.getByLabelText(/상품명/i)).toBeDefined();
        expect(screen.getByLabelText(/가격/i)).toBeDefined();
        expect(screen.getByLabelText(/재고 수량/i)).toBeDefined();
        expect(screen.getByLabelText(/상품 설명/i)).toBeDefined();
        expect(screen.getByText(/AI로 상품 설명 생성/i)).toBeDefined();
    });

    it('should handle input changes', () => {
        render(<ProductForm />);

        const nameInput = screen.getByLabelText(/상품명/i) as HTMLInputElement;
        fireEvent.change(nameInput, { target: { value: 'New Product' } });

        expect(nameInput.value).toBe('New Product');
    });


    it('should show validation errors on submit', async () => {
        render(<ProductForm />);

        const submitButton = screen.getByRole('button', { name: /저장/i });
        fireEvent.change(screen.getByLabelText(/가격/i), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText(/재고/i), { target: { value: '' } });
        fireEvent.submit(submitButton.closest('form')!);
        // Also click just in case the listener is on the button (it's on the form though)
        // fireEvent.click(submitButton);

        // Expect validation error for name (required)
        expect(await screen.findByText(/상품명을 입력해주세요/i)).toBeDefined();
        expect(await screen.findByText(/가격을 입력해주세요/i)).toBeDefined();
        expect(await screen.findByText(/재고를 입력해주세요/i)).toBeDefined();
    });
});
