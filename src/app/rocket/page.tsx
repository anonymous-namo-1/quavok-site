import { pageMeta } from "@/lib/meta";
import { CTA } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { SectionHead } from "@/components/Section";
import { CtaBand } from "@/components/CtaBand";
import { RocketVignette } from "@/components/RocketVignette";
import { FaqList, faqJsonLd } from "@/components/Faq";
import type { Faq } from "@/lib/faqs";
import { ArrowIcon } from "@/components/Icon";

export const metadata = pageMeta({title:"Rocket",description:"Ask about the automations Quavok builds and runs for you. See what happened, what needs your approval and what comes next.",path:"/rocket/"});
const ROCKET_FAQS: Faq[] = [
  {q:"Can Rocket build or change an automation?",a:["No. Rocket forwards new requests to the Quavok team. We scope, build and run the automation with you."]},
  {q:"Do I need Rocket to use Quavok?",a:["No. Your automations run without it. Rocket is an optional way to interact with them."]},
  {q:"What can Rocket see?",a:["Rocket is designed to answer about the automations Quavok runs for your business. What it can access is agreed with you as part of the scope."]},
  {q:"How can I get Rocket?",a:["Ask for it when you discuss your automation with the Quavok team."]},
];
export default function RocketPage(){return <>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqJsonLd(ROCKET_FAQS))}} />
  <PageHero eyebrow="Rocket" title="Less digging. Just ask Rocket." lead="What’s done? What needs you? Rocket gives you a conversational way to ask about the automations we build and run for you.">
    <a className="btn btn-primary" href={CTA.discuss.href}>{CTA.discuss.label}<ArrowIcon /></a>
  </PageHero>
  <section className="section pt-4" aria-label="Rocket conversation"><div className="wrap" data-rv><RocketVignette /></div></section>
  <section className="section border-t border-line" aria-labelledby="questions-title"><div className="wrap">
    <SectionHead id="questions-title" eyebrow="" title="The work. The decisions. What’s next." />
    <dl className="rocket-question-rows">
      <div><dt>What happened?</dt><dd>Ask for a summary of the work your automations handled.</dd></div>
      <div><dt>What needs me?</dt><dd>See the items waiting for your approval or judgment.</dd></div>
      <div><dt>Can we automate this too?</dt><dd>Rocket passes the request to our team. We work through the scope and handle the build.</dd></div>
    </dl>
  </div></section>
  <section className="section pt-0" aria-labelledby="rfaq-title"><div className="wrap grid gap-12 lg:grid-cols-[0.7fr_1.3fr]"><SectionHead id="rfaq-title" eyebrow="" title="About Rocket." /><div data-rv><FaqList items={ROCKET_FAQS} /></div></div></section>
  <CtaBand />
</>}
