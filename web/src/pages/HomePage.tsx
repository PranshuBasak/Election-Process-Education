import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="flex-1 pt-8 md:pt-16 flex flex-col items-center w-full px-4 md:px-lg max-w-5xl mx-auto pb-24">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center text-center mt-xl">
        <h1 className="font-h1-editorial text-h1-editorial text-primary mb-xl max-w-3xl leading-tight">
          Understand the election, <br className="hidden sm:block" />
          <span className="text-on-surface">one question at a time.</span>
        </h1>
        
        {/* Prompt Input */}
        <div className="w-full max-w-2xl bg-surface-container-lowest border border-surface-variant rounded-xl shadow-sm p-2 flex items-center gap-2 mb-lg focus-within:ring-2 focus-within:ring-primary-container focus-within:ring-offset-2 transition-all">
          <span className="material-symbols-outlined text-outline pl-2">search</span>
          <input 
            className="flex-1 bg-transparent border-none focus:ring-0 font-ui-body text-ui-body text-on-surface py-3 outline-none placeholder:text-outline-variant" 
            placeholder="Ask anything about voting, candidates, or processes..." 
            type="text"
          />
          <button className="bg-secondary-container text-on-secondary-fixed-variant font-ui-header text-ui-header px-6 py-3 rounded-lg flex items-center gap-1 hover:bg-secondary-fixed-dim transition-colors">
            Ask
          </button>
        </div>

        {/* Starter Chips */}
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
          <button className="px-4 py-2 rounded-full border border-surface-variant bg-surface-container text-on-surface font-ui-label text-ui-label hover:bg-surface-variant transition-colors whitespace-nowrap">
            Am I eligible to vote?
          </button>
          <button className="px-4 py-2 rounded-full border border-surface-variant bg-surface-container text-on-surface font-ui-label text-ui-label hover:bg-surface-variant transition-colors whitespace-nowrap">
            Show the current election timeline
          </button>
          <button className="px-4 py-2 rounded-full border border-surface-variant bg-surface-container text-on-surface font-ui-label text-ui-label hover:bg-surface-variant transition-colors whitespace-nowrap">
            How is a vote counted?
          </button>
          <button className="px-4 py-2 rounded-full border border-surface-variant bg-surface-container text-on-surface font-ui-label text-ui-label hover:bg-surface-variant transition-colors whitespace-nowrap">
            What is the Model Code of Conduct?
          </button>
        </div>
      </section>

      {/* Bento Grid / Cards Row */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {/* Card 1: Interactive Timeline */}
        <Link 
          to="/timeline" 
          className="group relative overflow-hidden bg-surface-container-lowest border border-surface-variant rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer min-h-[280px]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container rounded-bl-[100px] opacity-5 -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary-container mb-2">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>timeline</span>
          </div>
          <h3 className="font-h2-editorial text-h2-editorial text-primary leading-tight">Interactive <br/>Timeline</h3>
          <p className="font-ui-body text-ui-body text-on-surface-variant mt-auto">
            Track crucial dates, registration deadlines, and upcoming civic milestones in your district.
          </p>
          <div className="flex items-center gap-1 text-primary-container font-ui-label text-ui-label mt-2 font-bold group-hover:text-primary transition-colors">
            Explore Timeline <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
          </div>
        </Link>

        {/* Card 2: Learn Modules */}
        <Link 
          to="/learn"
          className="group relative overflow-hidden bg-surface-container-lowest border border-surface-variant rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer min-h-[280px]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container rounded-bl-[100px] opacity-10 -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-secondary-container mb-2">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <h3 className="font-h2-editorial text-h2-editorial text-primary leading-tight">Learn <br/>Modules</h3>
          <p className="font-ui-body text-ui-body text-on-surface-variant mt-auto">
            Bite-sized, objective lessons on how government structures work and your role within them.
          </p>
          <div className="flex items-center gap-1 text-primary-container font-ui-label text-ui-label mt-2 font-bold group-hover:text-primary transition-colors">
            Start Learning <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
          </div>
        </Link>

        {/* Card 3: Glossary */}
        <Link 
          to="/glossary"
          className="group relative overflow-hidden bg-surface-container-lowest border border-surface-variant rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer min-h-[280px]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-on-surface rounded-bl-[100px] opacity-5 -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-2">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
          </div>
          <h3 className="font-h2-editorial text-h2-editorial text-primary leading-tight">Civic <br/>Glossary</h3>
          <p className="font-ui-body text-ui-body text-on-surface-variant mt-auto">
            Plain-language definitions for complex political jargon and procedural terminology.
          </p>
          <div className="flex items-center gap-1 text-primary-container font-ui-label text-ui-label mt-2 font-bold group-hover:text-primary transition-colors">
            Browse Terms <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
          </div>
        </Link>
      </section>
      
      {/* Footer is part of the page content here? Main layout can have it or page can. Let's put it here for now. */}
      <div className="flex-grow"></div>
      <footer className="w-full border-t border-surface-variant mt-24 py-12 px-6 bg-surface-container-lowest text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <p className="font-ui-body text-ui-body text-on-surface-variant max-w-2xl">
            Information provided on ElectionEdu is sourced from official government publications, independent electoral commissions, and verified civic datasets. It is intended for educational purposes and does not constitute legal voting advice.
          </p>
          <div className="bg-surface-container px-4 py-2 rounded-full flex items-center gap-2 mt-4">
            <span className="material-symbols-outlined text-[16px] text-outline">update</span>
            <span className="font-ui-label text-ui-label text-on-surface-variant uppercase tracking-wider">Sources last refreshed: October 12, 2023</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
