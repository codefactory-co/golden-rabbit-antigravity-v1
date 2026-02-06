'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createProductAction } from '../actions';
import ImageUploader from './ImageUploader';
import { Loader2, Wand2, Tag } from 'lucide-react';
import { Category } from '@/core/domain/entities/Category';
import { useRouter } from 'next/navigation';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { productSchema } from '../schema';
import type { FieldApi } from '@tanstack/react-form';

interface ProductFormProps {
    categories: Category[];
}

function FieldInfo({ field }: { field: any }) {
    return (
        <>
            {field.state.meta.errors.length > 0 ? (
                <p className="text-sm text-red-500 mt-1">
                    {field.state.meta.errors.map((err: any) => err?.message || err).join(', ')}
                </p>
            ) : null}
        </>
    );
}

export default function ProductForm({ categories = [] }: ProductFormProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const router = useRouter();

    const form = useForm({
        validatorAdapter: zodValidator(),
        validators: {
            onChange: productSchema,
            onSubmit: productSchema,
        },
        defaultValues: {
            name: '',
            categoryId: '' as unknown as number, // Initial empty state for select
            description: '',
            price: '' as unknown as number,
            stock: '' as unknown as number,
            images: [] as File[],
        },
        onSubmit: async ({ value }) => {
            const formData = new FormData();
            formData.append('name', value.name);
            if (value.categoryId) formData.append('categoryId', value.categoryId.toString());
            if (value.description) formData.append('description', value.description);
            formData.append('price', value.price.toString());
            formData.append('stock', value.stock.toString());

            value.images.forEach((file) => {
                formData.append('images', file);
            });

            const result = await createProductAction(formData);
            if (result && 'error' in result) {
                alert(result.error);
                return;
            }
        },
    } as any);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="space-y-6"
        >
            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <form.Field
                            name="name"
                            children={(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor={field.name}>상품명 <span className="text-red-500">*</span></Label>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="상품명을 입력하세요"
                                    />
                                    <FieldInfo field={field} />
                                </div>
                            )}
                        />
                        <form.Field
                            name="categoryId"
                            children={(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor={field.name}>카테고리 <span className="text-red-500">*</span></Label>
                                    {mounted ? (
                                        <Select
                                            name={field.name}
                                            value={field.state.value?.toString()}
                                            onValueChange={(value) => field.handleChange(Number(value))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="카테고리 선택" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500">
                                            카테고리 불러오는 중...
                                        </div>
                                    )}
                                    <FieldInfo field={field} />
                                </div>
                            )}
                        />
                    </div>

                    <form.Field
                        name="description"
                        children={(field) => (
                            <div className="space-y-2">
                                <Label htmlFor={field.name}>상품 설명</Label>
                                <Textarea
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="상품 설명을 입력하세요"
                                    rows={5}
                                />
                                <FieldInfo field={field} />
                            </div>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-6">
                        <form.Field
                            name="price"
                            children={(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor={field.name}>가격 (원) <span className="text-red-500">*</span></Label>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="number"
                                        min="0"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="0"
                                    />
                                    <FieldInfo field={field} />
                                </div>
                            )}
                        />
                        <form.Field
                            name="stock"
                            children={(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor={field.name}>재고 수량 <span className="text-red-500">*</span></Label>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="number"
                                        min="0"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="0"
                                    />
                                    <FieldInfo field={field} />
                                </div>
                            )}
                        />
                    </div>

                    <form.Field
                        name="images"
                        children={(field) => (
                            <div className="space-y-2">
                                <Label>상품 이미지</Label>
                                <ImageUploader
                                    images={field.state.value}
                                    onImagesChange={(newImages) => field.handleChange(newImages)}
                                />
                                <FieldInfo field={field} />
                            </div>
                        )}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4 flex gap-4">
                    <Button type="button" variant="outline" className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4" />
                        AI로 상품 설명 생성
                    </Button>
                    <Button type="button" variant="outline" className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        SEO 태그 추천
                    </Button>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    취소
                </Button>
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            저장
                        </Button>
                    )}
                />
            </div>
        </form>
    );
}
