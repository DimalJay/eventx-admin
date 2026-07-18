"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "@/service/authService";

const highlights = [
    {
        title: "Platform Overview",
        body: "Monitor global events, registrations, and analytics.",
    },
    {
        title: "User Management",
        body: "Manage organizers, attendees, and resolve support tickets.",
    },
    {
        title: "System Logs",
        body: "Track background tasks and system health in real-time.",
    },
];

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema)
    });

    const mutation = useMutation({
        mutationFn: async (data: LoginFormValues) => {
            return loginRequest(data);
        },
        onSuccess: () => {
            toast.success("Admin Login successful.");
            router.replace("/");
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || error?.message || "Login failed. Please try again.";
            toast.error(message);
        },
    });

    const onSubmit = (data: LoginFormValues) => {
        mutation.mutate(data);
    };

    return (
        <div className="flex flex-1 items-center justify-center bg-zinc-50">
            <main className="flex w-full max-w-5xl flex-col gap-10 px-8 py-20 sm:px-14">
                <div className="flex items-center gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            EventX Admin
                        </p>
                        <p className="text-lg font-semibold tracking-wide text-zinc-900">
                            Login to your account
                        </p>
                    </div>
                </div>

                <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
                    <section className="rounded-3xl border border-zinc-200/60 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.1)] backdrop-blur-md sm:p-8">
                        <div className="flex flex-col gap-3">
                            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-800">
                                Admin Sign in
                            </p>
                            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-4xl">
                                Command Center.
                            </h1>
                            <p className="text-sm leading-6 text-zinc-500">
                                Log in to manage event operations, user activities, and system configurations.
                            </p>
                        </div>

                        <form className="mt-8 grid gap-5" onSubmit={handleSubmit(onSubmit)}>
                            <label className="grid gap-2 text-sm font-semibold text-zinc-900">
                                Email address
                                <input
                                    type="email"
                                    autoComplete="email"
                                    placeholder="admin@eventx.com"
                                    {...register("email")}
                                    className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
                                />
                                {errors.email && <span className="text-red-500 text-xs font-normal">{errors.email.message}</span>}
                            </label>
                            <label className="grid gap-2 text-sm font-semibold text-zinc-900">
                                Password
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    {...register("password")}
                                    className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 text-base text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
                                />
                                {errors.password && <span className="text-red-500 text-xs font-normal">{errors.password.message}</span>}
                            </label>

                            <button
                                type="submit"
                                className="mt-2 flex h-12 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? "Signing in..." : "Sign in"}
                            </button>

                            <div className="flex flex-col gap-2 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t border-zinc-100">
                                <span>Restricted access for EventX Staff only.</span>
                            </div>
                        </form>
                    </section>

                    <section className="grid gap-4">
                        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 px-6 py-8 text-white shadow-xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                                Secure Access
                            </p>
                            <p className="mt-2 text-2xl font-semibold">
                                The heart of the platform.
                            </p>
                            <p className="mt-3 text-sm text-zinc-400">
                                Monitor real-time analytics, review system logs, and ensure everything runs smoothly.
                            </p>
                        </div>
                        <div className="grid gap-4 rounded-3xl border border-zinc-200/60 bg-white/80 p-6 backdrop-blur-md">
                            {highlights.map((highlight) => (
                                <div key={highlight.title} className="border-b border-zinc-100 pb-4 last:border-b-0 last:pb-0">
                                    <h2 className="text-base font-semibold text-zinc-900">{highlight.title}</h2>
                                    <p className="mt-1 text-sm text-zinc-500">{highlight.body}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
