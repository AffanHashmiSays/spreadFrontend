import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contactez-nous - Spread The Word',
  description: 'Contactez l\'équipe de Spread The Word. Nous accordons une grande importance à vos retours, questions et suggestions.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#708238] px-8 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contactez-nous
            </h1>
            <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-12">
            <div className="prose prose-lg max-w-none">
              <div className="text-center mb-12">
                <p className="text-xl text-gray-700 leading-relaxed">
                  Chez <span className="font-semibold text-[#708238]">Spread The Word</span>, nous accordons une grande importance à vos retours, questions et suggestions. Votre opinion nous aide à améliorer la qualité de notre contenu et à mieux répondre à vos attentes.
                </p>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-1 gap-8 mb-12">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-[#708238] rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">📩 Email</h2>
                  <a 
                    href="mailto:Info@spreadtheword.fr" 
                    className="text-2xl font-semibold text-[#708238] hover:text-green-700 transition-colors duration-300 hover:underline"
                  >
                    Info@spreadtheword.fr
                  </a>
                </div>
              </div>

              {/* Why Contact Us Section */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Pourquoi nous contacter ?</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-green-50 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-[#708238] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Questions</h3>
                    <p className="text-gray-600">Vous avez des questions sur nos articles ou notre fonctionnement ?</p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-[#708238] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Retours</h3>
                    <p className="text-gray-600">Partagez vos commentaires pour nous aider à nous améliorer.</p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-[#708238] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Suggestions</h3>
                    <p className="text-gray-600">Proposez-nous des idées d'articles ou d'améliorations.</p>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-8 mb-8">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-[#708238] rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Temps de réponse</h3>
                  <p className="text-lg text-gray-700">
                    Nous nous efforçons de répondre à tous les messages dans les <span className="font-semibold text-[#708238]">24-48 heures</span>.
                  </p>
                </div>
              </div>

              {/* Contact Form Placeholder */}
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Formulaire de contact</h3>
                <p className="text-gray-600 mb-6">
                  Un formulaire de contact interactif sera bientôt disponible sur cette page. En attendant, n'hésitez pas à nous écrire directement à l'adresse email ci-dessus.
                </p>
                <div className="inline-flex items-center px-6 py-3 bg-[#708238] text-white rounded-lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Bientôt disponible
                </div>
              </div>

              {/* Footer Message */}
              <div className="text-center mt-12">
                <div className="bg-[#708238] text-white rounded-xl p-6">
                  <p className="text-xl font-semibold mb-2">
                    Merci de votre confiance !
                  </p>
                  <p className="text-lg">
                    Votre feedback est précieux pour nous aider à améliorer Spread The Word.
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