import React from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import {
  Box,
  IconButton,
  Tooltip
} from '@mui/material';

import vn from "@/assets/vn.png"
import eng from "@/assets/eng.png"

const languages = [
  { code: 'en', name: 'English', flag: eng },
  { code: 'vi', name: 'Tiếng Việt', flag: vn }
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    // Toggle between 'en' and 'vi'
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
    Cookies.set('i18nextLng', newLang, { expires: 365 });
  };

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];
  const nextLang = languages.find(lang => lang.code !== i18n.language) || languages[1];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
      <Tooltip title={`Switch to ${nextLang.name}`}>
        <IconButton
          color="inherit"
          onClick={toggleLanguage}
          sx={{
            borderRadius: '8px',
            padding: '4px',
            fontSize: '1.5rem',
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
          }}
        >
          <img 
            src={currentLang.flag} 
            alt={currentLang.name}
            style={{ width: '24px', height: '24px', objectFit: 'cover' }}
          />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default LanguageSwitcher;