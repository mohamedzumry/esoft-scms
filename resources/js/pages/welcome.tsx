import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Course Management System">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a]">
                {/* Header */}
                <header className="w-full bg-white shadow-md dark:bg-[#161615] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                    <div className="container mx-auto flex items-center justify-between px-6 py-4 lg:px-8">
                        <h1 className="text-xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">SCMS</h1>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex grow flex-col p-6 lg:p-8">
                    {/* Hero Section */}
                    <section className="flex items-center justify-center py-12 lg:py-16">
                        <div className="w-full max-w-[335px] text-center lg:max-w-4xl">
                            <h2 className="mb-4 text-3xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">Welcome to Your Course Management System</h2>
                            <p className="mb-6 text-lg text-[#706f6c] dark:text-[#A1A09A]">
                                Streamline your academic journey with our intuitive platform. Manage courses, resources, and reservations
                                effortlessly—designed for students, instructors, and administrators alike.
                            </p>
                            <div className="flex flex-col gap-4 lg:flex-row lg:justify-center">
                                <Link
                                    href='#'
                                    className="inline-block rounded-sm border border-[#19140035] bg-[#1b1b18] px-6 py-2 text-sm font-medium text-white hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                                >
                                    Documentation
                                </Link>
                                <Link
                                    href="#"
                                    className="inline-block rounded-sm border border-[#19140035] px-6 py-2 text-sm font-medium text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="bg-[#F9F9F8] py-12 dark:bg-[#1C1C1A]">
                        <div className="container mx-auto px-6 lg:px-8">
                            <h3 className="mb-8 text-center text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Why Choose Our CMS?</h3>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                <div className="rounded-lg bg-white p-6 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:bg-[#2A2A28] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                                    <h4 className="mb-2 text-lg font-medium text-[#1b1b18] dark:text-[#EDEDEC]">User-Friendly Interface</h4>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Navigate with ease, whether you’re scheduling a class or booking a resource—no steep learning curve required.
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white p-6 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:bg-[#2A2A28] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                                    <h4 className="mb-2 text-lg font-medium text-[#1b1b18] dark:text-[#EDEDEC]">Role-Based Access</h4>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Tailored features for students, instructors, and admins ensure everyone gets what they need.
                                    </p>
                                </div>
                                <div className="rounded-lg bg-white p-6 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:bg-[#2A2A28] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                                    <h4 className="mb-2 text-lg font-medium text-[#1b1b18] dark:text-[#EDEDEC]">Real-Time Updates</h4>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Stay informed with instant updates on course schedules, resource availability, and more.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Modules Section */}
                    <section className="py-12">
                        <div className="container mx-auto px-6 lg:px-8">
                            <h3 className="mb-8 text-center text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Our Core Modules</h3>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F53003]">
                                        <svg
                                            className="h-8 w-8 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                                            />
                                        </svg>
                                    </div>
                                    <h4 className="mb-2 text-lg font-medium text-[#1b1b18] dark:text-[#EDEDEC]">Courses</h4>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Organize course schedules, track attendance, and manage assignments—all in one place.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F53003]">
                                        <svg
                                            className="h-8 w-8 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                            />
                                        </svg>
                                    </div>
                                    <h4 className="mb-2 text-lg font-medium text-[#1b1b18] dark:text-[#EDEDEC]">Resources</h4>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Book classrooms, equipment, and other resources with a simple, conflict-free system.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F53003]">
                                        <svg
                                            className="h-8 w-8 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <h4 className="mb-2 text-lg font-medium text-[#1b1b18] dark:text-[#EDEDEC]">Reservations</h4>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Schedule and manage reservations efficiently, ensuring optimal resource utilization.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Call to Action Section */}
                    <section className="bg-[#F9F9F8] py-12 text-center dark:bg-[#1C1C1A]">
                        <div className="container mx-auto px-6 lg:px-8">
                            <h3 className="mb-4 text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Ready to Simplify Your Academic Life?</h3>
                            <p className="mb-6 text-[#706f6c] dark:text-[#A1A09A]">
                                Join hundreds of users already benefiting from our Course Management System.
                            </p>
                            <Link
                                href={auth.user ? route('dashboard') : route('register')}
                                className="inline-block rounded-sm border border-[#19140035] bg-[#1b1b18] px-6 py-2 text-sm font-medium text-white hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                            >
                                {auth.user ? 'Go to Dashboard' : 'Sign Up Now'}
                            </Link>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="w-full bg-[#1b1b18] py-6 text-[#EDEDEC] dark:bg-[#161615]">
                    <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 lg:flex-row lg:px-8">
                        <p className="text-sm">&copy; {new Date().getFullYear()} Course Management System. All rights reserved.</p>
                        <nav className="flex gap-4 text-sm">
                            <a
                                href="https://your-site.com/about" // Replace with actual links
                                className="hover:text-[#FF4433]"
                            >
                                About
                            </a>
                            <a href="https://your-site.com/contact" className="hover:text-[#FF4433]">
                                Contact
                            </a>
                            <a href="https://your-site.com/privacy" className="hover:text-[#FF4433]">
                                Privacy Policy
                            </a>
                        </nav>
                    </div>
                </footer>
            </div>
        </>
    );
}
