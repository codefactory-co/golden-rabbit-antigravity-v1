-- Migration number: 00005_rls_policies.sql

-- 1. Users Policies
-- Data is readable by own user. 
CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = id);
-- Users generally can't update their own tier/role directly via API, mostly handled by backend/webhooks.
-- But for profile updates (name, image):
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);


-- 2. Plans Policies
-- Plans are public read-only (for pricing pages etc)
CREATE POLICY "Plans are viewable by everyone" ON public.plans FOR SELECT USING (true);


-- 3. Subscriptions Policies
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
-- Creation/Update usually handled by server-side payment webhooks, but assuming typical SaaS RLS:
-- We might restrict insert/update to service_role mostly, but for now allow read.


-- 4. Usage Policies
CREATE POLICY "Users can view own usage" ON public.usage FOR SELECT USING (auth.uid() = user_id);


-- 5. Payments Policies
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);


-- 6. Content (Folders, Notes, Tags) Policies
-- Folders
CREATE POLICY "Users can CRUD own folders" ON public.folders FOR ALL USING (auth.uid() = user_id);

-- Notes
CREATE POLICY "Users can CRUD own notes" ON public.notes FOR ALL USING (auth.uid() = user_id);

-- Tags
CREATE POLICY "Users can CRUD own tags" ON public.tags FOR ALL USING (auth.uid() = user_id);

-- Note Tags
-- For junction tables, we check if the user owns the related note.
CREATE POLICY "Users can CRUD own note tags" ON public.note_tags FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.notes WHERE id = note_tags.note_id AND user_id = auth.uid()
    )
);


-- 7. Activity Logs Policies
CREATE POLICY "Users can view own activity logs" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
-- Insert is usually done by the system or via API triggers. Allow insert for now if logged from client.
CREATE POLICY "Users can insert own activity logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
