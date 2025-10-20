
"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useAuth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { UtensilsCrossed } from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await sendPasswordResetEmail(auth, email);
            setIsSent(true);
            toast({
                title: "Email Sent",
                description: "A password reset link has been sent to your email address.",
            });
        } catch (error: any) {
            console.error("Password reset error:", error);
            let errorMessage = "An unexpected error occurred. Please try again.";
            if (error.code === 'auth/user-not-found') {
                errorMessage = "No account found with that email address.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Please enter a valid email address."
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mb-4 flex justify-center">
                            <Link href="/" className="flex items-center gap-2 text-foreground">
                                <UtensilsCrossed className="w-6 h-6 text-primary" />
                                <h1 className="text-2xl font-bold font-headline tracking-tight">
                                    ChefBot
                                </h1>
                            </Link>
                        </div>
                        <CardTitle className="text-2xl font-headline">Forgot Password?</CardTitle>
                        <CardDescription>
                            {isSent 
                                ? "Check your inbox for a password reset link." 
                                : "Enter your email and we'll send you a link to reset your password."
                            }
                        </CardDescription>
                    </CardHeader>
                    {!isSent ? (
                        <form onSubmit={handleResetPassword}>
                            <CardContent className="space-y-4">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Reset Failed</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <Button className="w-full" type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Reset Link
                                </Button>
                                <div className="text-center text-sm text-muted-foreground">
                                    Remember your password?{" "}
                                    <Link href="/signin" className="text-primary hover:underline">
                                        Sign in
                                    </Link>
                                </div>
                            </CardFooter>
                        </form>
                    ) : (
                        <CardFooter>
                             <Button className="w-full" asChild>
                                <Link href="/signin">Back to Sign In</Link>
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
}
