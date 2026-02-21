interface ContentSection {
  id: string;
  title: string;
  content: string;
}

interface ArticleBodyProps {
  sections: ContentSection[];
  className?: string;
}

export function ArticleBody({ sections, className = '' }: ArticleBodyProps) {
  return (
    <div className={`article-body ${className}`}>
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2
            className="text-h2 font-semibold text-[var(--color-text-primary)] mt-12 mb-4"
            style={{ fontFamily: 'var(--font-heading), var(--font-heading-ar), Georgia, serif' }}
          >
            {section.title}
          </h2>
          <div
            className="text-body text-[var(--color-text-primary)] [&>p]:mb-6 [&>ul]:mb-6 [&>ol]:mb-6 [&>ul]:list-disc [&>ul]:ps-6 [&>ol]:list-decimal [&>ol]:ps-6 [&_li]:mb-2 [&_a]:text-[var(--color-accent)] [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </section>
      ))}
    </div>
  );
}
