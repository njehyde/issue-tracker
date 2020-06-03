import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { debounce } from 'lodash';

import { Label, Required, Text } from 'components/styled';

const customStyles = isMulti => ({
  clearIndicator: provided => ({
    ...provided,
    padding: '0px 8px',
  }),
  dropdownIndicator: provided => ({
    ...provided,
    padding: '0px 8px',
  }),
  control: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#fff' : '#f4f5f7',
    border: state.isFocused
      ? '1px solid rgba(0, 136, 169, 1)'
      : '1px solid #dfe1e6',
    borderRadius: '0.25rem',
    margin: 0,
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    minHeight: 'calc(1.5em + 0.5rem + 1.5px)',
    '&:hover': {
      backgroundColor: '#fff',
      borderColor: 'rgba(0, 136, 169, 1)',
    },
    outline: state.isFocused && 0,
    boxShadow: state.isFocused && '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
  }),
  valueContainer: provided => ({
    ...provided,
    padding: isMulti ? '0rem 0.25rem' : '0px 0.75rem',
  }),
  input: provided => ({
    ...provided,
    paddingTop: 0,
    paddingLeft: isMulti ? '0.5rem' : 0,
    paddingBottom: 0,
    color: '#172b4d',
  }),
  placeholder: provided => ({
    ...provided,
    marginLeft: isMulti ? '0.5rem' : 0,
    marginRight: 0,
  }),
  singleValue: provided => ({
    ...provided,
    color: '#172b4d',
    marginLeft: 0,
    marginRight: 0,
  }),
  menuPortal: base => ({ ...base, zIndex: 9999 }),
});

class LookupField extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    error: PropTypes.objectOf(PropTypes.any),
    isAsync: PropTypes.bool,
    isCreatable: PropTypes.bool,
    isMulti: PropTypes.bool,
    isSearchable: PropTypes.func,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    required: PropTypes.bool,
    transformOptions: PropTypes.objectOf(PropTypes.any),
    value: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
    loadOptions: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onGetNewOptionData: PropTypes.func,
    onInputChange: PropTypes.func,
  };

  debounceLoadOptions = debounce((inputValue, callback) => {
    const { value, loadOptions } = this.props;
    loadOptions(inputValue, value, (options, selectValue) => {
      callback(options);
      if (selectValue) {
        this.setState({ selectValue });
      }
    });
  }, 500);

  constructor(props) {
    super(props);

    let matched = null;
    let transformedOptions = [];
    const { options, value } = props;

    if (options) {
      transformedOptions = this.transformOptions(options);
      matched = transformedOptions?.find(option => option.value === value);
    }

    this.state = {
      selectValue: matched,
      options: transformedOptions,
    };

    this.selectRef = React.createRef();
  }

  transformOptions = options => {
    const { transformOptions } = this.props;
    if (transformOptions) {
      return options?.map(transformOptions);
    }

    return options?.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
  };

  handleInputChange = value => {
    const { onInputChange } = this.props;
    return onInputChange(value);
  };

  handleChange = option => {
    const { isMulti, onChange } = this.props;

    if (isMulti) {
      const transformedOptions = option?.map(
        ({ label, value, ...otherProps }) => ({
          ...otherProps,
          value: value?.toLowerCase(),
        }),
      );

      onChange(transformedOptions || []);

      this.setState({ selectValue: option });
      return transformedOptions;
    }

    const { value } = option;
    onChange(value);
    this.setState({ selectValue: option });
    return null;
  };

  handleGetNewOptionData = (value, label) => {
    const { onGetNewOptionData } = this.props;
    return onGetNewOptionData(value, label);
  };

  handleKeyDown = event => {
    const { selectRef } = this;
    let onMenuOpen;
    let menuIsOpen;
    let focusedOptionRef;

    // eslint-disable-next-line no-proto
    if (selectRef.__proto__.constructor.name === 'StateManager') {
      onMenuOpen = selectRef?.onMenuOpen;
      menuIsOpen = selectRef?.state?.menuIsOpen;
      focusedOptionRef = selectRef?.select?.focusedOptionRef;
    } else {
      onMenuOpen = selectRef?.select?.onMenuOpen;
      menuIsOpen = selectRef?.select?.state?.menuIsOpen;
      focusedOptionRef = selectRef?.select?.select?.focusedOptionRef;
    }

    switch (event.key) {
      case 'Enter':
        if (!menuIsOpen && onMenuOpen) {
          onMenuOpen();
        }
        if (menuIsOpen && focusedOptionRef) {
          focusedOptionRef.click();
        }

        event.preventDefault();
        break;

      default:
        break;
    }
  };

  render() {
    const {
      error,
      isAsync,
      isCreatable,
      isMulti,
      label,
      name,
      autoFocus,
      required,
      isSearchable = true,
    } = this.props;
    const { options, selectValue } = this.state;
    const styles = customStyles(isMulti);

    const customComponents = { LoadingIndicator: null };

    return (
      <>
        <Label htmlFor={name}>
          {label}
          {required && <Required>*</Required>}
        </Label>
        {isCreatable && (
          <>
            {isAsync && (
              <AsyncCreatableSelect
                styles={styles}
                ref={el => {
                  this.selectRef = el;
                }}
                name={name}
                cacheOptions
                isMulti={isMulti}
                defaultOptions
                loadOptions={this.debounceLoadOptions}
                isSearchable={isSearchable}
                autoFocus={autoFocus}
                value={selectValue}
                onKeyDown={this.handleKeyDown}
                onChange={this.handleChange}
                onInputChange={this.handleInputChange}
                getNewOptionData={this.handleGetNewOptionData}
                components={customComponents}
                menuPortalTarget={document.getElementById('popover-root')}
                menuPosition="absolute"
                menuPlacement="auto"
              />
            )}
          </>
        )}
        {!isCreatable && (
          <>
            {isAsync && (
              <AsyncSelect
                styles={styles}
                ref={el => {
                  this.selectRef = el;
                }}
                name={name}
                cacheOptions
                defaultOptions
                loadOptions={this.debounceLoadOptions}
                isSearchable={isSearchable}
                autoFocus={autoFocus}
                value={selectValue}
                onKeyDown={this.handleKeyDown}
                onChange={this.handleChange}
                components={customComponents}
                menuPortalTarget={document.getElementById('popover-root')}
                menuPosition="absolute"
                menuPlacement="auto"
              />
            )}
            {!isAsync && (
              <Select
                styles={styles}
                ref={el => {
                  this.selectRef = el;
                }}
                name={name}
                options={options}
                isSearchable={isSearchable}
                autoFocus={autoFocus}
                value={selectValue}
                onKeyDown={this.handleKeyDown}
                onChange={this.handleChange}
                menuPortalTarget={document.getElementById('popover-root')}
                menuPosition="absolute"
                menuPlacement="auto"
              />
            )}
          </>
        )}
        {error && <Text.Error>{error}</Text.Error>}
      </>
    );
  }
}

export default LookupField;
