import Link from "next/link";
import {
  ListChecks,
  Sparkles,
  FileText,
  AtSign,
  MessageSquare,
  Search,
  Check,
  ArrowRight,
} from "lucide-react";
import { ToolLayout } from "@/components/ToolLayout";
import { ChannelNameGeneratorTool } from "@/components/tools/ChannelNameGeneratorTool";
import { buildMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-catalog";
import { FaqSchema } from "@/components/PageSchemas";
import { RelatedGuideCallout } from "@/components/ToolContentSections";

const tool = getToolBySlug("youtube-channel-name-generator")!;

export const metadata = buildMetadata({
  title: "YouTube Channel Name Generator | Free AI Name Ideas",
  description:
    "Generate YouTube channel name ideas for free with AI. Get brandable names, username-style handles, niche-based ideas, and tips for checking availability.",
  path: `tools/${tool.slug}`,
  noBrand: true,
  ogVariant: tool.isAI ? { ai: true } : undefined,
});

const HERO_SUBTITLE =
  "Generate 10 YouTube channel name ideas based on your niche, style, and creator identity. Get brandable names, username-style handles, and a quick way to check availability.";

type Card = { Icon: typeof ListChecks; title: string; body: string };

const WHAT_YOU_GET: Card[] = [
  {
    Icon: ListChecks,
    title: "10 channel name ideas",
    body: "Generate a fresh batch of YouTube name ideas from your niche, audience, and style.",
  },
  {
    Icon: Sparkles,
    title: "Brandable options",
    body: "Get short, memorable names that can grow into a recognizable creator brand.",
  },
  {
    Icon: FileText,
    title: "Descriptive names",
    body: "Create names that clearly tell viewers what your channel is about.",
  },
  {
    Icon: AtSign,
    title: "Username-style handles",
    body: "See handle-friendly versions you can adapt for YouTube, Instagram, TikTok, or other platforms.",
  },
  {
    Icon: MessageSquare,
    title: "Name rationales",
    body: "Understand why each name fits your niche, tone, or target viewer.",
  },
  {
    Icon: Search,
    title: "Availability checks",
    body: "Use search links to check whether a name or similar channel already exists before you commit.",
  },
];

const HOW_TO_STEPS = [
  {
    title: "Describe your channel niche clearly",
    body: 'Do not write "travel." Write "solo travel tips for women over 40 on a budget." The more specific the niche, the more useful the name ideas.',
  },
  {
    title: "Choose a name style",
    body: "Use Mixed if you want variety. Pick short and brandable, descriptive, personality-driven, playful, or professional depending on the channel you want to build.",
  },
  {
    title: "Add your name if the channel is personality-led",
    body: "If the channel depends on your face, story, expertise, or personal brand, adding your name can make the suggestions more natural.",
  },
  {
    title: "Generate names and shortlist the strongest options",
    body: "Look for names that are easy to say, easy to remember, and still make sense after seeing the thumbnail or channel banner.",
  },
  {
    title: "Check availability before committing",
    body: "Search YouTube for your top choices, check the handle, and look for similar names. Name collisions can make your channel harder to find.",
  },
];

const SEO_TIPS = [
  "Keep it easy to say. If someone cannot repeat the name after hearing it once, it may be too complicated.",
  "Make the niche clear when discovery matters. Descriptive names can help new viewers understand the channel faster, especially for education, reviews, finance, fitness, travel, and tutorials.",
  "Use brandable names when you want room to grow. Short invented names can work well for media-style channels, but they usually need more time to build recognition.",
  "Check the YouTube handle separately. Your display name and @handle can differ, but a clean matching handle is easier to remember and promote.",
  "Avoid names too close to existing channels. Even if a name is technically available, similar names can confuse viewers and weaken search visibility.",
  "Think beyond the first 10 videos. Do not choose a name so narrow that it blocks future topics you already know you may cover.",
  "Check trademarks and brand conflicts. Avoid names that copy companies, creators, or registered brands. When in doubt, choose a more original option.",
  "Test it on a banner and thumbnail. A channel name should still look clean in a YouTube banner, profile card, and search result.",
];

const STYLE_GUIDE = [
  {
    title: "Short and brandable",
    body: "Best for channels that want a media-brand feel. These names are easier to own but may not explain the niche immediately.",
  },
  {
    title: "Descriptive",
    body: "Best for search-first channels. These names tell viewers what the channel is about and can work well for tutorials, reviews, education, and niche advice.",
  },
  {
    title: "Personality-driven",
    body: "Best for face-led creators. These names use your name, persona, or point of view so viewers connect the channel with you.",
  },
  {
    title: "Playful",
    body: "Best for entertainment, lifestyle, comedy, gaming, and casual creator brands. These names rely on wordplay, tone, and memorability.",
  },
  {
    title: "Professional",
    body: "Best for B2B, finance, education, business, and expert-led channels where trust matters more than playfulness.",
  },
];

const AVAILABILITY_CHECKLIST = [
  "Search the exact name on YouTube.",
  "Search the name without spaces and with common spelling variations.",
  "Check whether the matching @handle is available.",
  "Search Google for the name plus your niche.",
  "Check major social platforms if you plan to use the same brand everywhere.",
  "Avoid names that look too close to established creators or trademarks.",
];

const RELATED_TOOLS = [
  {
    href: "/tools/youtube-niche-check",
    name: "Niche Check",
    body: "Validate whether your channel idea has enough demand and room to grow.",
  },
  {
    href: "/tools/youtube-video-idea-generator",
    name: "Video Idea Generator",
    body: "Generate your first batch of video ideas around the channel concept.",
  },
  {
    href: "/tools/youtube-keyword-tool",
    name: "YouTube Keyword Tool",
    body: "Find search terms and topics people already use on YouTube.",
  },
  {
    href: "/tools/youtube-title-generator",
    name: "YouTube Title Generator",
    body: "Turn your first video ideas into click-worthy titles.",
  },
  {
    href: "/tools/youtube-channel-audit",
    name: "Channel Audit",
    body: "Use this later when the channel has uploads and you want to find recurring issues.",
  },
];

const FAQS = [
  {
    q: "Is this YouTube Channel Name Generator free?",
    a: "Yes. The YouTube Channel Name Generator is free to use with no signup required. Some AI usage may have fair-use limits to keep the tool available.",
  },
  {
    q: "What is a YouTube channel name generator?",
    a: "A YouTube channel name generator creates name ideas from your niche, audience, style, and optional creator name. It helps you brainstorm brandable, descriptive, playful, professional, or personality-driven names before starting a channel.",
  },
  {
    q: "How do I choose a good YouTube channel name?",
    a: "A good YouTube channel name is easy to say, easy to remember, relevant to your niche, and not too close to an existing creator or brand. It should fit your content now while leaving enough room for future topics.",
  },
  {
    q: "Can this generate YouTube usernames and handles?",
    a: "Yes. You can use the results as YouTube username ideas or adapt them into @handles by removing spaces, simplifying spelling, or adding a short modifier related to your niche.",
  },
  {
    q: "Can you check if a YouTube name is available?",
    a: "The tool can help you search candidate names, but you should verify availability manually. Search YouTube, check the @handle, look for similar channels, and check broader brand or trademark conflicts before committing.",
  },
  {
    q: "Should I use my real name for my YouTube channel?",
    a: "Use your real name if the channel is built around your personality, expertise, face, or personal story. Use a brand name if you want the channel to feel bigger than one person, easier to sell later, or flexible for a team.",
  },
  {
    q: "Should my channel name include my niche keyword?",
    a: 'It can help, especially for search-first channels. A name like "Budget Travel Mom" tells viewers what to expect immediately. A brandable name can also work, but it usually needs stronger thumbnails, titles, and consistent positioning to become recognizable.',
  },
  {
    q: "How long should a YouTube channel name be?",
    a: "Shorter is usually better. Many strong channel names are 1-3 words and easy to fit on a banner, profile card, and thumbnail. Avoid long names that are hard to remember or type.",
  },
  {
    q: "What is the difference between a channel name and a YouTube handle?",
    a: "Your channel name is the display name viewers see. Your YouTube handle is the unique @name used for mentions, channel URLs, and identity across YouTube. They can be different, but matching or similar names are easier to remember.",
  },
  {
    q: "Can I rename my existing YouTube channel?",
    a: "Yes, YouTube lets creators change channel names, but renaming an established channel can confuse subscribers and weaken brand recall. Before renaming, make sure the new name fits your future content direction.",
  },
  {
    q: "Are generated channel names copyrightable?",
    a: "Short names and phrases are usually not protected by copyright in the same way full creative works are, but trademarks and brand conflicts can still matter. Treat generated names as ideas and check for conflicts before using one commercially.",
  },
  {
    q: "Can I use these names for commercial channels?",
    a: "Yes, you can use generated ideas for personal, client, or commercial channels. You should still edit, verify, and check availability before using a name publicly.",
  },
];

export default function YouTubeChannelNameGeneratorPage() {
  return (
    <>
      <FaqSchema faqs={FAQS} />
      <ToolLayout tool={tool} subtitleOverride={HERO_SUBTITLE}>
        <ChannelNameGeneratorTool />
      </ToolLayout>

      {/* What you'll get */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              What you&apos;ll get
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              The YouTube Channel Name Generator helps you move from a rough
              niche to names you can actually shortlist, say out loud, and
              check before committing.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_YOU_GET.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl text-center">
            How to use the YouTube Channel Name Generator
          </h2>

          <ol className="mt-12 space-y-6">
            {HOW_TO_STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Naming tips */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            YouTube channel naming tips
          </h2>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            A good YouTube channel name should be memorable, searchable, and
            honest about the kind of content viewers will get.
          </p>

          <ul className="mt-8 space-y-3">
            {SEO_TIPS.map((tip) => (
              <li
                key={tip}
                className="flex gap-3 rounded-lg bg-gray-50/60 p-4 text-sm text-gray-700 leading-relaxed ring-1 ring-gray-100"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                  aria-hidden="true"
                />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            About the AI YouTube Channel Name Generator
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            The AI YouTube Channel Name Generator helps new creators, rebrands,
            and content teams turn a niche into practical channel name ideas.
            It works as a YouTube name generator, YouTube channel name
            generator, username generator, and handle brainstorming tool.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            Describe your channel, choose a style, optionally add your own
            name, and generate a list of ideas with short rationales. Use the
            output to build a shortlist, then check YouTube search, handles,
            social profiles, and trademarks before choosing your final name.
          </p>
          <p className="mt-4 text-base text-gray-700 leading-relaxed">
            The tool is best used early in the creator workflow, before you
            design branding, publish videos, or build a content calendar
            around a name.
          </p>
        </div>
      </section>

      {/* Choosing between styles */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Choosing the right channel name style
          </h2>

          <ul className="mt-8 space-y-5">
            {STYLE_GUIDE.map((s) => (
              <li key={s.title}>
                <h3 className="text-base font-semibold text-gray-900">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                  {s.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How to check availability */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            How to check if a YouTube channel name is available
          </h2>
          <p className="mt-5 text-base text-gray-700 leading-relaxed">
            A name can look available but still be risky if another creator,
            company, or social profile is already using something very close.
            Before choosing a final name, check these places:
          </p>

          <ul className="mt-8 space-y-3 rounded-2xl border border-gray-200 bg-white p-5">
            {AVAILABILITY_CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-800">
                <Check
                  className="h-4 w-4 shrink-0 text-brand-600 mt-0.5"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-xs text-gray-500 leading-relaxed">
            Note: SEO Check Tools can help you generate and search candidate
            names, but it cannot guarantee legal availability or trademark
            clearance.
          </p>
        </div>
      </section>

      <RelatedGuideCallout slug={tool.slug} />

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl text-center">
            Frequently asked
          </h2>
          <dl className="mt-10 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
            {FAQS.map((item) => (
              <details
                key={item.q}
                className="group px-5 py-4 sm:px-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-3 text-left text-sm font-semibold text-gray-900 sm:text-base">
                  <span>{item.q}</span>
                  <span className="mt-0.5 text-gray-400 transition-transform group-open:rotate-180">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <dd className="mt-3 text-sm text-gray-700 leading-relaxed">
                  {item.a}
                </dd>
              </details>
            ))}
          </dl>
        </div>
      </section>

      {/* Related tools */}
      <section className="border-t border-gray-100 bg-gray-50/40 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Plan your channel after choosing a name
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Once you have a shortlist, use these tools to validate the niche
              and plan the first videos.
            </p>
          </div>

          <div className="mx-auto mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RELATED_TOOLS.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-200 hover:shadow-sm"
              >
                <p className="text-base font-semibold text-gray-900 group-hover:text-brand-700 transition">
                  {r.name}
                </p>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  {r.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-600 group-hover:text-brand-700 transition">
                  Open tool
                  <ArrowRight
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2.25}
                  />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/tools" className="link text-sm">
              Browse all YouTube SEO tools →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gray-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Ready to name your YouTube channel?
          </h2>
          <p className="mt-4 text-base text-gray-600 sm:text-lg leading-relaxed">
            Describe your niche and generate 10 free AI YouTube channel name
            ideas in seconds.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-600 transition"
            >
              Generate channel names
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
