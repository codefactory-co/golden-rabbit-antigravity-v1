import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetDashboardDataUseCase } from './GetDashboardDataUseCase';
import { ISubscriptionRepository } from '../interfaces/ISubscriptionRepository';
import { IUsageRepository } from '../interfaces/IUsageRepository';
import { IActivityRepository } from '../interfaces/IActivityRepository';
import { Subscription } from '../entities/Subscription';
import { UsageStats } from '../entities/UsageStats';
import { ActivityLog } from '../entities/ActivityLog';

describe('GetDashboardDataUseCase', () => {
    let useCase: GetDashboardDataUseCase;
    let mockSubscriptionRepo: ISubscriptionRepository;
    let mockUsageRepo: IUsageRepository;
    let mockActivityRepo: IActivityRepository;

    const mockSubscription: Subscription = {
        planName: 'Pro',
        status: 'Active',
        nextBillingDate: new Date('2025-02-15'),
        amount: 9900,
        paymentMethod: { brand: 'Visa', last4: '4242' },
    };

    const mockUsage: UsageStats = {
        noteCount: 234,
        maxNoteCount: -1,
        storageUsed: 3.2 * 1024 * 1024 * 1024,
        storageLimit: 10 * 1024 * 1024 * 1024,
        aiSummaryCount: 45,
        maxAiSummaryCount: 100,
    };

    const mockActivities: ActivityLog[] = [
        {
            id: '1',
            type: 'CREATE_NOTE',
            description: 'New Note',
            metadata: '1 hour ago',
            icon: 'edit_note',
            colorClass: 'bg-blue-50',
        },
    ];

    beforeEach(() => {
        mockSubscriptionRepo = {
            getSubscription: vi.fn(),
        };
        mockUsageRepo = {
            getUsageStats: vi.fn(),
        };
        mockActivityRepo = {
            getRecentActivities: vi.fn(),
        };

        useCase = new GetDashboardDataUseCase(
            mockSubscriptionRepo,
            mockUsageRepo,
            mockActivityRepo
        );
    });

    it('should aggregate data from all repositories', async () => {
        vi.mocked(mockSubscriptionRepo.getSubscription).mockResolvedValue(mockSubscription);
        vi.mocked(mockUsageRepo.getUsageStats).mockResolvedValue(mockUsage);
        vi.mocked(mockActivityRepo.getRecentActivities).mockResolvedValue(mockActivities);

        const result = await useCase.execute('user-123');

        expect(result.subscription).toEqual(mockSubscription);
        expect(result.usage).toEqual(mockUsage);
        expect(result.activities).toEqual(mockActivities);

        expect(mockSubscriptionRepo.getSubscription).toHaveBeenCalledWith('user-123');
        expect(mockUsageRepo.getUsageStats).toHaveBeenCalledWith('user-123');
        expect(mockActivityRepo.getRecentActivities).toHaveBeenCalledWith('user-123');
    });

    it('should return nulls if repositories return null', async () => {
        vi.mocked(mockSubscriptionRepo.getSubscription).mockResolvedValue(null);
        vi.mocked(mockUsageRepo.getUsageStats).mockResolvedValue(null);
        vi.mocked(mockActivityRepo.getRecentActivities).mockResolvedValue([]);

        const result = await useCase.execute('user-123');

        expect(result.subscription).toBeNull();
        expect(result.usage).toBeNull();
        expect(result.activities).toEqual([]);
    });
});
