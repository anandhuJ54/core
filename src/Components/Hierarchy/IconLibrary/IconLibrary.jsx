import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  IconButton,
  Slider,
  TextField,
  InputAdornment
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faSearch } from '@fortawesome/pro-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import './IconLibrary.scss';

library.add(fas);

const itemsPerPage = 40;

const IconLibraryPage = (props) => {
  const { iconFunc, propSelectedIcon, iconNameIs, equipmentId } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchLibrary, setShowSearchLibrary] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState({ iconName: '' });

  const filteredIcons = Object.keys(fas).filter((iconName) =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setSearchTerm(''); // Clear the search term when propSelectedIcon or iconNameIs changes
  }, [propSelectedIcon, iconNameIs]);

  const totalPages = Math.ceil(filteredIcons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleIcons = filteredIcons.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset page to 1 when the search term changes
  };

  const handleSearchIconClick = () => {
    setShowSearchLibrary(!showSearchLibrary);
  };

  const handleIconSelect = (iconName) => {
    setSelectedIcon({ iconName });
    setShowSearchLibrary(false);
    iconFunc({ iconName });
  };

  return (
    <Container className='iconlibrary'>
      <div className='icon-main-library'>
        <Typography className='text'>Icon</Typography>
        <TextField
          className="searchbar-iconlibrary"
          placeholder="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={fas[selectedIcon.iconName || iconNameIs]} className='icon-fontawesome' />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" onClick={handleSearchIconClick}>
                <FontAwesomeIcon icon={faSearch} style={{ cursor: 'pointer' }} />
              </InputAdornment>
            ),
          }}
        />
      </div>
      {showSearchLibrary && (
        <div className='icon-dropdown'>
          <div
            className='icon-dropdown-level'
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '20px',
            }}
          >
            <IconButton onClick={handlePrevPage} disabled={currentPage === 1} className='icon-dropdown-left'>
              <FontAwesomeIcon icon={faArrowLeft} />
            </IconButton>
            <Slider
              className='icon-slider'
              value={currentPage}
              onChange={handlePageChange}
              min={1}
              max={totalPages}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
            <IconButton
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className='icon-dropdown-left'
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </IconButton>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            {visibleIcons.map((iconName) => (
              <div key={iconName} style={{ margin: '10px', cursor: 'pointer' }} onClick={() => handleIconSelect(iconName)}>
                <FontAwesomeIcon icon={fas[iconName]} size="1x" />
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
};

export default IconLibraryPage;
