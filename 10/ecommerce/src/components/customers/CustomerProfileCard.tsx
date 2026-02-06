import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CustomerProfile } from "@/core/domain/entities/CustomerDetail";
import { Mail, Phone, Calendar, PenSquare } from "lucide-react";
import { format } from "date-fns";

interface CustomerProfileCardProps {
    profile: CustomerProfile;
}

export function CustomerProfileCard({ profile }: CustomerProfileCardProps) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                            <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                {profile.name.slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-sm"
                        >
                            <PenSquare className="h-4 w-4" />
                        </Button>
                    </div>

                    <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
                    <p className="text-muted-foreground mb-6 text-sm">Customer ID: {profile.id}</p>

                    <div className="w-full space-y-3 px-4">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                            <Mail className="h-4 w-4 text-primary" />
                            <span className="truncate">{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                            <Phone className="h-4 w-4 text-primary" />
                            <span>{profile.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>가입일: {format(new Date(profile.joinedAt), 'yyyy-MM-dd')}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
