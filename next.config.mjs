/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "oxfordscienceenterprises-cms.com",
                port: "",
            },
            {
                protocol: "https",
                hostname: "**.oxfordscienceenterprises-cms.com",
                port: "",
            },
        ],
    },
    // Enable CSS optimization
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
    // Modern browser optimizations
    experimental: {
        // Enable modern JavaScript features
        esmExternals: true,
        // Optimize for modern browsers
        optimizePackageImports: ['framer-motion', 'gsap', 'lottie-react', 'swiper', 'react-hook-form'],
    },
    // Optimize bundle for modern browsers
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            // Enhanced code splitting for better performance
            config.optimization.splitChunks = {
                chunks: 'all',
                minSize: 20000,
                maxSize: 244000,
                cacheGroups: {
                    // Vendor libraries
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        priority: 10,
                        reuseExistingChunk: true,
                    },
                    // Heavy animation libraries
                    animations: {
                        test: /[\\/]node_modules[\\/](gsap|framer-motion|lottie-react)[\\/]/,
                        name: 'animations',
                        priority: 20,
                        reuseExistingChunk: true,
                    },
                    // UI libraries
                    ui: {
                        test: /[\\/]node_modules[\\/](swiper|react-hook-form)[\\/]/,
                        name: 'ui',
                        priority: 15,
                        reuseExistingChunk: true,
                    },
                    // Common components
                    common: {
                        name: 'common',
                        minChunks: 2,
                        priority: 5,
                        reuseExistingChunk: true,
                    },
                    // CSS optimization
                    styles: {
                        name: 'styles',
                        test: /\.(css|scss)$/,
                        chunks: 'all',
                        enforce: true,
                    },
                },
            };

            // Tree shaking optimization
            config.optimization.usedExports = true;
            config.optimization.sideEffects = false;
        }

        // Reduce polyfills for modern browsers
        config.resolve.fallback = {
            ...config.resolve.fallback,
            // Only include essential polyfills
            fs: false,
            net: false,
            tls: false,
        };

        // Optimize module resolution
        config.resolve.alias = {
            ...config.resolve.alias,
            // Reduce bundle size by using lighter alternatives where possible
        };

        return config;
    },
    // Handle API routes properly
    async rewrites() {
        return [];
    },
    // Configure headers for favicon cache busting
    async headers() {
        return [
            {
                source: '/icon.ico',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                ],
            },
            {
                source: '/favicon.ico',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                ],
            },
        ];
    },
    // Configure redirects
    async redirects() {
        return [
            { source: "/news/portfolio-news-oxford-ionics-reaches-agreement-to-be-acquired-by-ionq", destination: "/news/oxford-ionics-reaches-agreement-to-be-acquired-by-ionq-for-1-075-billion", permanent: true },
            { source: "/news/oxford-spinout-oxford-semantic-technologies-acquired-by-samsung-electronics", destination: "/news/oxford-semantic-technologies-to-be-acquired-by-samsung-electronics", permanent: true },
            { source: "/news/ose-announces-groundbreaking-new-partnership-with-the-crown-estate-and-pioneer-group-to-provide-vital-workspace-to-support-uks-science-technology-and-innovation-ambitions", destination: "/news/oxford-science-enterprises-announces-partnership-with-the-crown-estate-and-pioneer-group", permanent: true },
            { source: "/uncover-translational-funding", destination: "/uncover", permanent: true },
            { source: "/investors/register", destination: "/shareholder-portal", permanent: true },
            { source: "/investors/forgot", destination: "/shareholder-portal", permanent: true },
            { source: "/team", destination: "https://www.oxfordscienceenterprises.com/who#team-members", permanent: true },
            { source: "/team/andrew-straiton", destination: "https://www.oxfordscienceenterprises.com/who/andrew-straiton", permanent: true },
            { source: "/team/george-todd", destination: "https://www.oxfordscienceenterprises.com/who/george-todd", permanent: true },
            { source: "/team/karandeep-bhogal", destination: "https://www.oxfordscienceenterprises.com/who/karandeep-bhogal", permanent: true },
            { source: "/team/kirsty-lloyd-jukes", destination: "https://www.oxfordscienceenterprises.com/who/kirsty-lloyd-jukes", permanent: true },
            { source: "/team/mark-chadwick", destination: "https://www.oxfordscienceenterprises.com/who/mark-chadwick", permanent: true },
            { source: "/team/martin-fiennes", destination: "https://www.oxfordscienceenterprises.com/who/martin-fiennes", permanent: true },
            { source: "/team/sam-harman", destination: "https://www.oxfordscienceenterprises.com/who/sam-harman", permanent: true },
            { source: "/team/sami-walter", destination: "https://www.oxfordscienceenterprises.com/who/sami-walter", permanent: true },
            { source: "/team/william-goodlad", destination: "https://www.oxfordscienceenterprises.com/who/william-goodlad", permanent: true },
            { source: "/team/chris-ashton", destination: "https://www.oxfordscienceenterprises.com/who/chris-ashton", permanent: true },
            { source: "/team/claire-brown", destination: "https://www.oxfordscienceenterprises.com/who/claire-brown", permanent: true },
            { source: "/team/clare-gumbley", destination: "https://www.oxfordscienceenterprises.com/who/clare-gumbley", permanent: true },
            { source: "/team/craig-fox", destination: "https://www.oxfordscienceenterprises.com/who/craig-fox", permanent: true },
            { source: "/team/eleonora-lugara", destination: "https://www.oxfordscienceenterprises.com/who/eleonora-lugara", permanent: true },
            { source: "/team/jon-hepple", destination: "https://www.oxfordscienceenterprises.com/who/jon-hepple", permanent: true },
            { source: "/team/katharina-ramshorn", destination: "https://www.oxfordscienceenterprises.com/who/katharina-ramshorn", permanent: true },
            { source: "/team/katya-smirnyagina", destination: "https://www.oxfordscienceenterprises.com/who/katya-smirnyagina", permanent: true },
            { source: "/team/sally-dewhurst", destination: "https://www.oxfordscienceenterprises.com/who/sally-dewhurst", permanent: true },
            { source: "/team/sanne-de-jongh", destination: "https://www.oxfordscienceenterprises.com/who/sanne-de-jongh", permanent: true },
            { source: "/team/scott-ellis", destination: "https://www.oxfordscienceenterprises.com/who/scott-ellis", permanent: true },
            { source: "/team/harry-clifford", destination: "https://www.oxfordscienceenterprises.com/who/harry-clifford", permanent: true },
            { source: "/team/heather-roxborough", destination: "https://www.oxfordscienceenterprises.com/who/heather-roxborough", permanent: true },
            { source: "/team/joel-schoppig", destination: "https://www.oxfordscienceenterprises.com/who/joel-schoppig", permanent: true },
            { source: "/team/katherine-ward", destination: "https://www.oxfordscienceenterprises.com/who/katherine-ward", permanent: true },
            { source: "/team/lauren-laing", destination: "https://www.oxfordscienceenterprises.com/who/lauren-laing", permanent: true },
            { source: "/team/liliane-chamas", destination: "https://www.oxfordscienceenterprises.com/who/liliane-chamas", permanent: true },
            { source: "/team/peter-weston-smith", destination: "https://www.oxfordscienceenterprises.com/who/peter-weston-smith", permanent: true },
            { source: "/team/tatiana-lobanov-rostovsky", destination: "https://www.oxfordscienceenterprises.com/who/tatiana-lobanov-rostovsky", permanent: true },
            { source: "/team/tony-besse", destination: "https://www.oxfordscienceenterprises.com/who/tony-besse", permanent: true },
            { source: "/team/alex-hammacher", destination: "https://www.oxfordscienceenterprises.com/who/alex-hammacher", permanent: true },
            { source: "/team/alma-simangunsong", destination: "https://www.oxfordscienceenterprises.com/who/alma-simangunsong", permanent: true },
            { source: "/team/andre-crawford-brunt", destination: "https://www.oxfordscienceenterprises.com/who/andre-crawford-brunt", permanent: true },
            { source: "/team/athene-blakeman", destination: "https://www.oxfordscienceenterprises.com/who/athene-blakeman", permanent: true },
            { source: "/team/bernard-taylor", destination: "https://www.oxfordscienceenterprises.com/team/bernard-taylor", permanent: true },
            { source: "/team/charo-bajo", destination: "https://www.oxfordscienceenterprises.com/who/charo-bajo", permanent: true },
            { source: "/team/chris-chambers", destination: "https://www.oxfordscienceenterprises.com/who/chris-chambers", permanent: true },
            { source: "/team/daoud-khan", destination: "https://www.oxfordscienceenterprises.com/who/daoud-khan", permanent: true },
            { source: "/team/ed-bussey", destination: "https://www.oxfordscienceenterprises.com/who/ed-bussey", permanent: true },
            { source: "/team/emily-matthews", destination: "https://www.oxfordscienceenterprises.com/who/emily-matthews", permanent: true },
            { source: "/team/fiona-murray", destination: "https://www.oxfordscienceenterprises.com/who/fiona-murray", permanent: true },
            { source: "/team/gaelle-newton", destination: "https://www.oxfordscienceenterprises.com/who/gaelle-newton", permanent: true },
            { source: "/team/iwona-dombek-wieczorek", destination: "https://www.oxfordscienceenterprises.com/who/iwona-dombek-wieczorek", permanent: true },
            { source: "/team/jack-edmondson", destination: "https://www.oxfordscienceenterprises.com/who/jack-edmondson", permanent: true },
            { source: "/team/jack-strudley", destination: "https://www.oxfordscienceenterprises.com/who/jack-strudley", permanent: true },
            { source: "/team/jeanette-lovis", destination: "https://www.oxfordscienceenterprises.com/who/jeanette-lovis", permanent: true },
            { source: "/team/jim-wilkinson", destination: "https://www.oxfordscienceenterprises.com/who/jim-wilkinson", permanent: true },
            { source: "/team/john-roberts", destination: "https://www.oxfordscienceenterprises.com/who/john-roberts", permanent: true },
            { source: "/team/jon-wall", destination: "https://www.oxfordscienceenterprises.com/who/jon-wall", permanent: true },
            { source: "/team/katie-hudson", destination: "https://www.oxfordscienceenterprises.com/who/katie-hudson", permanent: true },
            { source: "/team/lilly-bussmann", destination: "https://www.oxfordscienceenterprises.com/who/lilly-bussmann", permanent: true },
            { source: "/team/lisa-bedwell", destination: "https://www.oxfordscienceenterprises.com/who/lisa-bedwell", permanent: true },
            { source: "/team/matthew-myers", destination: "https://www.oxfordscienceenterprises.com/who/matthew-myers", permanent: true },
            { source: "/team/nick-dixon-clegg", destination: "https://www.oxfordscienceenterprises.com/who/nick-dixon-clegg", permanent: true },
            { source: "/team/oliver-mahony", destination: "https://www.oxfordscienceenterprises.com/who/oliver-mahony", permanent: true },
            { source: "/team/pete-wilder", destination: "https://www.oxfordscienceenterprises.com/who/pete-wilder", permanent: true },
            { source: "/team/peter-donnelly", destination: "https://www.oxfordscienceenterprises.com/who/peter-donnelly", permanent: true },
            { source: "/team/polly-elvin", destination: "https://www.oxfordscienceenterprises.com/who/polly-elvin", permanent: true },
            { source: "/team/rachel-mckee", destination: "https://www.oxfordscienceenterprises.com/who/rachel-mckee", permanent: true },
            { source: "/team/sam-harris", destination: "https://www.oxfordscienceenterprises.com/who/sam-harris", permanent: true },
            { source: "/team/satoko-robertson", destination: "https://www.oxfordscienceenterprises.com/who/satoko-robertson", permanent: true },
            { source: "/team/simon-boddie", destination: "https://www.oxfordscienceenterprises.com/who/simon-boddie", permanent: true },
            { source: "/team/sive-ozer", destination: "https://www.oxfordscienceenterprises.com/who/sive-ozer", permanent: true },
            { source: "/team/wallace-wallace", destination: "https://www.oxfordscienceenterprises.com/who/wallace-wallace", permanent: true },
            { source: "/news/science-innovation-must-be-at-the-heart-of-government-action", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-welcomes-benny-axt-as-healthtech-entrepreneur-in-residence", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-partners-with-tokyu-land-to-connect-oxford-spinouts-with-japans-innovation-ecosystem-2", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-appoints-harry-clifford-as-health-tech-entrepreneur-in-residence", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-appoints-mark-chadwick-as-deep-tech-scientist-in-residence", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-and-cedars-sinai-announce-new-partnership-cemented-with-their-first-co-investment-in-neurology-care-company-neu-health", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-appoints-karandeep-bhogal-as-deep-tech-entrepreneur-in-residence", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-appoints-professor-dame-fiona-murray-and-professor-sir-peter-donnelly-as-non-executive-directors", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-welcomes-kirsty-lloyd-jukes-as-an-entrepreneur-in-residence-to-accelerate-company-creation", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/highlights/2023", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/ose-response-to-treasurys-independent-review-of-university-spinouts", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-strengthens-health-tech-team-with-appointments-of-two-new-entrepreneurs-in-residence", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-appoints-ed-bussey-as-chief-executive-officer", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/our-2022-highlights", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-strengthens-life-sciences-investment-team-with-appointment-of-sanne-de-jongh-as-partner", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxfordvr-to-combine-with-behavr-to-confront-the-mental-health-crisis-with-the-largest-vr-delivery-platform-for-evidence-based-digital-therapeutics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-portfolio-company-djs-antibodies-to-be-acquired-by-abbvie", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-portfolio-company-mirobio-to-be-acquired-by-gilead-sciences-for-approximately-405-million", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-appoints-richard-laxer-former-chairman-and-ceo-of-ge-capital-as-a-non-executive-director", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/new-report-highlights-oxford-as-the-uks-leading-university-for-spinout-creation-with-oxford-science-enterprises-named-as-most-active-fund-focused-solely-on-a-single-institution", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-strengthens-investment-teams-with-two-new-appointments", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-enters-agreement-with-lothbury-to-develop-state-of-the-art-r-d-facilities-in-oxford-city-centre", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-strengthens-investment-teams-with-two-senior-appointments", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-enters-2022-with-strengthened-senior-leadership-team", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-board-update", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/breakthrough-for-oxfords-covid-vaccine-co-invented-by-vaccitech", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-announces-the-sale-of-base-genomics-to-exact-sciences", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/oxford-science-enterprises-appoints-alexis-dormandy-as-chief-executive-officer", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:pepgen", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:base-genomics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:first-light-fusion", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:odqa", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:oxford-ionics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:oxford-ionics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:evolito", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:quantum-motion-technologies", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:quantum-motion-technologies", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:omass-therapeutics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:vaccitech", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:theolytics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:nucleome-therapeutics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:nucleome-therapeutics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:caristo-diagnostics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:caristo-diagnostics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:oxford-nanoimaging", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:navenio", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:refeyn", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:refeyn", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:alloyed", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:alloyed", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:archangel-lightworks", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:bibliu", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:bibliu", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:diffblue", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:fluorok", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:fluorok", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:fractile", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:fractile", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:hexr", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:living-optics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:mind-foundry", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:mixergy", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:moa-technology", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:natcap-research", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:natcap-research", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:navlive", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:orca-computing", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:oxford-flow", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:oxford-flow", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:oxford-quantum-circuits", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:oxford-quantum-circuits", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:oxford-semantic-technologies", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:pqshield", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:pqshield", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:prolific", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:prolific", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:salience-labs", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:salience-labs", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:seloxium", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:wild-bioscience", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:wild-bioscience", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:yasa", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:amber-therapeutics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:genomics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:genomics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:neu-health-digital", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:osler-diagnostics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:oxford-endovascular", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:perspectum-diagnostics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:ultromics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:alethiomics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:alveogene", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:beacon-therapeutics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:circadian-therapeutics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:dark-blue-therapeutics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:djs-antibodies", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:endlyz", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:evox-therapeutics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:grey-wolf-therapeutics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:iota-sciences", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:iota-sciences", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:kesmalea", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:mirobio", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:orbit-discovery", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:scenic-biotech", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:sitryx", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:spybiotech", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/company:t-cypher-bio", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/talent/in/company:t-cypher-bio", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/news/portfolio-news-oxford-ionics-reaches-agreement-to-be-acquired-by-ionq", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/news/oxford-spinout-oxford-semantic-technologies-acquired-by-samsung-electronics", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/news/science-innovation-must-be-at-the-heart-of-government-action", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/news/in/news/ose-announces-groundbreaking-new-partnership-with-the-crown-estate-and-pioneer-group-to-provide-vital-workspace-to-support-uks-science-technology-and-innovation-ambitions", destination: "https://www.oxfordscienceenterprises.com/news", permanent: true },
            { source: "/about/what-we-do", destination: "https://www.oxfordscienceenterprises.com/what", permanent: true },
            { source: "/about/faqs", destination: "https://www.oxfordscienceenterprises.com/what", permanent: true },
            { source: "/sector/deep-tech", destination: "https://www.oxfordscienceenterprises.com/deep-tech", permanent: true },
            { source: "/sector/life-sciences", destination: "https://www.oxfordscienceenterprises.com/life-sciences", permanent: true },
            { source: "/sector/health-tech", destination: "https://www.oxfordscienceenterprises.com/health-tech", permanent: true },
            { source: "/talent", destination: "https://www.oxfordscienceenterprises.com/who", permanent: true },
            { source: "/submit-an-idea", destination: "https://www.oxfordscienceenterprises.com/form", permanent: true },
        ]
    }
};

export default nextConfig;
