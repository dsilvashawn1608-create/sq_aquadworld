import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FinalCTA from "@/components/sections/FinalCTA";
import JsonLd from "@/components/seo/JsonLd";
import PageHeader from "@/components/ui/PageHeader";
import { posts } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { site, siteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return pageMetadata({ title: post.title, description: post.description, path: `/blog/${post.slug}/` });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          author: { "@type": "Person", name: site.brand.founder },
          publisher: { "@type": "Organization", name: site.brand.name, url: siteUrl },
          mainEntityOfPage: `${siteUrl}/blog/${post.slug}/`,
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/blog/" },
          { name: post.title, path: `/blog/${post.slug}/` },
        ])}
      />
      <PageHeader
        title={post.title}
        lede={post.description}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Journal", href: "/blog/" },
          { name: post.title, href: `/blog/${post.slug}/` },
        ]}
      />
      <article className="pb-[clamp(5rem,10vw,9rem)]">
        <div className="wrap">
          <div className="mx-auto max-w-[58ch]">
            {post.body.map((para, i) => (
              <p key={i} className="story">
                {para}
              </p>
            ))}
          </div>
        </div>
      </article>
      <FinalCTA />
    </>
  );
}
