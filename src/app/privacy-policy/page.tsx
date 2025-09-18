import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité - Spread The Word',
  description: 'Découvrez notre politique de confidentialité et comment nous protégeons vos données personnelles sur Spread The Word.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#708238] px-8 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Politique de confidentialité
            </h1>
            <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-12">
            <div className="prose prose-lg max-w-none">
              <div className="text-center mb-12">
                <p className="text-xl text-gray-700 leading-relaxed">
                  La protection de vos données personnelles est une priorité pour <span className="font-semibold text-[#708238]">Spread The Word</span>. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous naviguez sur notre site.
                </p>
              </div>

              {/* Section 1 */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#708238] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    1
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Collecte des informations</h2>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <p className="text-gray-700 mb-4">Nous pouvons recueillir certaines données lorsque vous :</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#708238] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">Consultez notre site (données de navigation, adresse IP, type de navigateur, etc.)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#708238] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">Remplissez notre formulaire de contact</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#708238] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">Vous abonnez à notre newsletter</span>
                    </li>
                  </ul>
                  <p className="text-gray-700 mt-4 font-medium">
                    Ces informations sont utilisées uniquement dans le cadre de nos services et ne sont jamais revendues à des tiers.
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#708238] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    2
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Utilisation des données</h2>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <p className="text-gray-700 mb-4">Les données collectées servent à :</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#708238] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">Améliorer l'expérience utilisateur et la qualité du contenu</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#708238] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">Répondre à vos demandes via le formulaire de contact</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#708238] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">Vous envoyer des informations ou newsletters (si vous y avez consenti)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#708238] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    3
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Cookies</h2>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <p className="text-gray-700">
                    Notre site utilise des <strong>cookies</strong> afin d'améliorer la navigation et de mesurer l'audience. Vous pouvez gérer ou désactiver les cookies via les paramètres de votre navigateur.
                  </p>
                </div>
              </div>

              {/* Section 4 */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#708238] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    4
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Partage des données</h2>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <p className="text-gray-700">
                    Vos informations personnelles ne sont jamais partagées avec des tiers, sauf si la loi l'exige ou en cas de partenariat explicitement mentionné.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#708238] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    5
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Sécurité des données</h2>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <p className="text-gray-700">
                    Nous mettons en place des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, perte ou divulgation.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#708238] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    6
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Vos droits</h2>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <p className="text-gray-700 mb-4">
                    Conformément au <strong>Règlement Général sur la Protection des Données (RGPD)</strong>, vous disposez des droits suivants :
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#708238] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">Droit d'accès, de rectification et de suppression de vos données</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#708238] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">Droit d'opposition au traitement de vos données</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-[#708238] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">Droit à la portabilité de vos données</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-[#708238]">
                    <p className="text-gray-700">
                      Pour exercer vos droits, vous pouvez nous contacter à : <a href="mailto:Info@spreadtheword.fr" className="text-[#708238] font-semibold hover:underline">Info@spreadtheword.fr</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 7 */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#708238] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    7
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Modifications de la politique</h2>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <p className="text-gray-700">
                    Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. Toute mise à jour sera publiée sur cette page avec la date de révision.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-12">
                <div className="bg-[#708238] text-white rounded-xl p-6">
                  <p className="text-lg">
                    Cette politique de confidentialité est effective à compter du {new Date().toLocaleDateString('fr-FR')}.
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