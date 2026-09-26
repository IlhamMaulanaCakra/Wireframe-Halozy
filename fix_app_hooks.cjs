const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);',
  `const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(() => {
    return sessionStorage.getItem('halozy_privacy_shown') && !sessionStorage.getItem('halozy_guidelines_shown');
  });`
);

code = code.replace(
  `const handleClosePrivacy = () => {
    sessionStorage.setItem('halozy_privacy_shown', 'true');
    setIsPrivacyOpen(false);
  };`,
  `const handleClosePrivacy = () => {
    sessionStorage.setItem('halozy_privacy_shown', 'true');
    setIsPrivacyOpen(false);
    if (!sessionStorage.getItem('halozy_guidelines_shown')) {
      setIsGuidelinesOpen(true);
    }
  };

  const handleCloseGuidelines = () => {
    sessionStorage.setItem('halozy_guidelines_shown', 'true');
    setIsGuidelinesOpen(false);
  };`
);

code = code.replace('<GuidelinesModal isOpen={isGuidelinesOpen} onClose={() => setIsGuidelinesOpen(false)} />', '<GuidelinesModal isOpen={isGuidelinesOpen} onClose={handleCloseGuidelines} />');

fs.writeFileSync('src/App.tsx', code);
