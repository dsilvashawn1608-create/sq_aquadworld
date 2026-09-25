import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

export default function NotFound() {
  return (
    <>
      <PageHeader title="This page has drifted away" lede="The page you were looking for does not exist or has moved." />
      <section className="pb-[clamp(6rem,12vw,11rem)]">
        <div className="wrap flex flex-wrap gap-6">
          <Link href="/" className="btn btn-primary">
            Back to the homepage
          </Link>
          <Link href="/projects/" className="btn btn-glass">
            View portfolio
          </Link>
        </div>
      </section>
    </>
  );
}
