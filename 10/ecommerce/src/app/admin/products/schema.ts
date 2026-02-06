
import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(1, '상품명을 입력해주세요.'),
    categoryId: z.coerce.number().min(1, '카테고리를 선택해주세요.'),
    description: z.string(),
    price: z.string().min(1, '가격을 입력해주세요.').transform((val) => Number(val)).refine((val) => val >= 0, '가격은 0원 이상이어야 합니다.'),
    stock: z.string().min(1, '재고를 입력해주세요.').transform((val) => Number(val)).refine((val) => val >= 0, '재고는 0개 이상이어야 합니다.'),
    images: z.array(z.instanceof(File)),
});

export type ProductFormValues = z.infer<typeof productSchema>;
