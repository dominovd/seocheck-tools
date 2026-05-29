import Link from "next/link";
import { ToolLayout } from "@/components/ToolLayout";
import { ChannelNameGeneratorTool } from "@/components/tools/ChannelNameGeneratorTool";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";

const tool = getToolBySlug("youtube-channel-name-generator")!;

export const metadata = buildMetadata({
  title: tool.title,
  description: tool.metaDescription,
  path: `tools/${tool.slug}`,
});

const FAQS = [
  {
    q: "Can you check if a name is available?",
    a: "Not from this tool directly — YouTube's handle availability API requires authentication. Each result includes a 'Check' link that opens a YouTube search for the name, letting you confirm in 5 seconds whether someone already has the channel.",
  },
  {
    q: "What makes a good YouTube channel name?",
    a: "Short enough to fit on a banner (under 20-25 characters works), easy to say out loud (you'll hear it in your own intros), unique enough to search for without colliding with existing channels, and ideally tells the viewer something about the channel's focus. Names you can't say to a friend out loud usually fail the recall test.",
  },
  {
    q: "Should I use my real name?",
    a: "Pick the 'Personality-driven' style and include your name — the model will weave it into several variants. Real names work great for solo creators and shoulder/face-led channels. For format-focused channels (review channels, listicle channels, narrated content) a brand name often outperforms.",
  },
  {
    q: "What about handles (@names)?",
    a: "YouTube handles must be unique platform-wide. Your channel name and handle can differ — the displayed name is what viewers see, the handle is the URL-friendly identifier. We show a suggested @handle next to each name (lowercased, spaces removed) so you can preview what it would look like in URLs.",
  },
  {
    q: "Should I worry about trademarks?",
    a: "Yes, especially if the name is close to an existing brand. The model tries to avoid obvious trademarks, but always double-check the top 3-5 you like via a quick trademark search and a YouTube search. If a name is already in heavy use by an established channel — even without trademark — you'll lose search visibility to them.",
  },
  {
    q: "Can I rename my existing channel?",
    a: "Yes. YouTube allows changing your channel name up to 3 times every 14 days. Your URL handle is separate and can also be changed (with restrictions). Renaming after a substantial audience exists is risky — viewers expect consistency — but pre-monetization is the right time to nail it.",
  },
  {
    q: "Are the names copyrightable?",
    a: "Names themselves can't be copyrighted but can be trademarked. The model generates names from scratch — what you do with them is up to you. We claim no ownership over generated names.",
  },
];

export default function YouTubeChannelNameGeneratorPage() {
  return (
    <>
      <ToolLayout tool={tool}>
        <ChannelNameGeneratorTool />
      </ToolLayout>

      <section className="border-t border-gray-100 bg-gray-50/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            About the AI Channel Name Generator
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Describe what your channel is about, pick a style (or keep
            Mixed for variety), optionally include your own name, and get 10
            channel name ideas with a one-line rationale each. Each comes
            with a YouTube search link to check whether the name is already
            taken.
          </p>
          <p className="mt-3 text-base text-gray-700 leading-relaxed">
            The model runs at high creative temperature for this tool. Same
            niche on a different click returns a different batch — generate
            2-3 and shortlist the names that pass the &quot;can I say this
            out loud to a friend without cringing&quot; test.
          </p>

          <h3 className="mt-10 text-lg font-semibold text-gray-900">
            Choosing between the styles
          </h3>
          <ul className="mt-3 space-y-3 text-sm text-gray-700">
            <li>
              <strong>Short &amp; brandable.</strong> 1-2 words, often made-up.
              Works for product-style channels (think Vox, Wired). Easy to
              own; harder for first-time viewers to guess what it&apos;s about.
            </li>
            <li>
              <strong>Descriptive.</strong> Tells viewers the niche
              immediately. Great for SEO and trust; harder to pivot later.
            </li>
            <li>
              <strong>Personality-driven.</strong> Uses your name or persona.
              Works for face-led channels; ties your brand to you.
            </li>
            <li>
              <strong>Playful.</strong> Puns and wordplay. Memorable but can
              feel less serious — good for entertainment, comedy, lifestyle.
            </li>
            <li>
              <strong>Professional.</strong> Authoritative, agency-grade
              feel. Best for B2B, finance, education channels targeting
              decision-makers.
            </li>
          </ul>

          <h3 className="mt-12 text-lg font-semibold text-gray-900">
            Frequently asked questions
          </h3>
          <div className="mt-4 divide-y divide-gray-200">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between text-base font-medium text-gray-900">
                  {q}
                  <span className="ml-4 shrink-0 text-gray-400 transition-transform group-open:rotate-45 text-xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="text-base font-semibold text-gray-900">Related tools</h3>
            <p className="mt-1 text-sm text-gray-600">
              Once you&apos;ve picked a name, plan the first batch of content.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              <li>
                <Link href="/tools/youtube-video-idea-generator" className="link text-sm">
                  AI Video Idea Generator →
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-keyword-tool" className="link text-sm">
                  Keyword Tool →
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-money-calculator" className="link text-sm">
                  Money Calculator →
                </Link>
              </li>
              <li>
                <Link href="/tools" className="link text-sm">
                  All YouTube tools →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
