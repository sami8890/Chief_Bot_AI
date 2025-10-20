
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuth, useFirestore } from "@/firebase";
import { setDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { UtensilsCrossed } from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SignUpPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();
    const firestore = useFirestore();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            await updateProfile(user, {
                displayName: name,
            });

            await setDoc(doc(firestore, "users", user.uid), {
                name: name,
                email: email,
                joinedDate: new Date().toISOString(),
            });
            
            toast({
                title: "Account Created",
                description: "Welcome! Your account has been successfully created.",
            });
            router.push("/");
        } catch (error: any) {
            console.error("Sign up error:", error);
            let errorMessage = "An unexpected error occurred. Please try again.";
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = "This email is already in use. Please try signing in instead.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "The email address you entered is not valid. Please check and try again.";
                    break;
                case 'auth/weak-password':
                    errorMessage = "The password is too weak. It must be at least 6 characters long.";
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
                        <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
                        <CardDescription>Enter your details to get started.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSignUp}>
                        <CardContent className="space-y-4">
                             {error && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Sign Up Failed</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" type="text" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input 
                                        id="password" 
                                        type={showPassword ? "text" : "password"} 
                                        required 
                                        value={password} onChange={(e) => setPassword(e.target.value)} 
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
                                Create Account
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/signin" className="text-primary hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
