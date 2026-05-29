import Link from "next/link";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container as="main" className="py-24 text-center">
      <p className="font-mono text-sm text-gray-500">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 text-base text-gray-600">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="btn-primary mt-8 inline-flex">
        Back to home
      </Link>
    </Container>
  );
}
