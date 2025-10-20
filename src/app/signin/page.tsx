
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { UtensilsCrossed } from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function SignInPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({
                title: "Signed In",
                description: "Welcome back! You have successfully signed in.",
            });
            router.push("/");
        } catch (error: any) {
            console.error("Sign in error:", error);
            let errorMessage = "An unexpected error occurred. Please try again.";
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    errorMessage = "Invalid credentials. Please check your email and password and try again.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "The email address you entered is not valid. Please check and try again.";
                    break;
                case 'auth/user-disabled':
                    errorMessage = "This account has been disabled. Please contact support for assistance.";
                    break;
                 case 'auth/too-many-requests':
                    errorMessage = "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.";
                    break;
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
                        <CardTitle className="text-2xl font-headline">Welcome Back!</CardTitle>
                        <CardDescription>Sign in to your account to continue.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSignIn}>
                        <CardContent className="space-y-4">
                            {error && (
                               <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Sign In Failed</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="/forgot-password" passHref>
                                       <Button variant="link" className="px-0 h-auto text-xs">Forgot Password?</Button>
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input 
                                        id="password" 
                                        type={showPassword ? "text" : "password"} 
                                        required 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link href="/signup" className="text-primary hover:underline">
                                    Sign up
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
