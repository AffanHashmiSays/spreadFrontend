import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos de nous - Spread The Word',
  description: 'Découvrez Spread The Word, votre source d\'actualités fiables et pertinentes en langue française. Notre mission : informer, inspirer et rapprocher les lecteurs.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#708238] px-8 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              À propos de nous
            </h1>
            <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-12">
            <div className="prose prose-lg max-w-none">
              <div className="text-center mb-12">
                <p className="text-xl text-gray-700 leading-relaxed">
                  Bienvenue sur <span className="font-semibold text-[#708238]">Spread The Word</span>, votre nouvelle source d'actualités fiables et pertinentes en langue française.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-[#708238] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 ml-4">Notre Mission</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Notre mission est simple : <strong>informer, inspirer et rapprocher</strong> les lecteurs grâce à un contenu clair, accessible et vérifié.
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-[#708238] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 ml-4">Notre Engagement</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Nous mettons un point d'honneur à respecter l'<strong>éthique journalistique</strong>, à diversifier nos sources et à offrir des analyses de qualité.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Nos Domaines de Couverture</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Politique', icon: '🏛️' },
                    { name: 'Économie', icon: '📈' },
                    { name: 'Technologie', icon: '💻' },
                    { name: 'Sport', icon: '⚽' },
                    { name: 'Culture', icon: '🎭' },
                    { name: 'Lifestyle', icon: '🌟' },
                    { name: 'International', icon: '🌍' },
                    { name: 'National', icon: '🇫🇷' }
                  ].map((domain, index) => (
                    <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl mb-2">{domain.icon}</div>
                      <div className="text-sm font-medium text-gray-700">{domain.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Nous couvrons un large éventail de thématiques, allant de l'actualité nationale et internationale aux domaines essentiels tels que la politique, l'économie, la technologie, le sport, la culture et le lifestyle. Notre équipe s'engage à vous fournir des articles de qualité, rédigés avec sérieux et impartialité.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Chez <span className="font-semibold text-[#708238]">Spread The Word</span>, nous croyons que l'information doit être partagée de manière responsable. C'est pourquoi nous mettons un point d'honneur à respecter l'éthique journalistique, à diversifier nos sources et à offrir des analyses qui aident nos lecteurs à mieux comprendre le monde qui les entoure.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  Notre objectif n'est pas seulement de rapporter les faits, mais aussi de donner du sens à l'actualité, afin que chaque lecteur puisse se forger sa propre opinion.
                </p>

                <div className="bg-[#708238] text-white rounded-xl p-6">
                  <p className="text-xl font-semibold">
                    Merci de nous faire confiance et de choisir Spread The Word pour rester informé au quotidien.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}