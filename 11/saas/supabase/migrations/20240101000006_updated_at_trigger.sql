-- Migration number: 00006_updated_at_trigger.sql

-- Apply the moddatetime trigger to every table that has an updated_at column
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE PROCEDURE moddatetime();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE PROCEDURE moddatetime();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.folders
    FOR EACH ROW EXECUTE PROCEDURE moddatetime();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.notes
    FOR EACH ROW EXECUTE PROCEDURE moddatetime();
