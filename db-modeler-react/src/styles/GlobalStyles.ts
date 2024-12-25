import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${props => props.theme.fonts.normal};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.kawaii};
    margin-bottom: 1rem;
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color ${props => props.theme.transitions.fast};

    &:hover {
      color: ${props => props.theme.colors.secondary};
    }
  }

  button {
    cursor: pointer;
    font-family: ${props => props.theme.fonts.normal};
  }

  .ant-card {
    border-radius: ${props => props.theme.borderRadius.medium};
    box-shadow: ${props => props.theme.shadows.small};
    transition: all ${props => props.theme.transitions.normal};

    &:hover {
      box-shadow: ${props => props.theme.shadows.medium};
      transform: translateY(-2px);
    }
  }

  .ant-btn {
    border-radius: ${props => props.theme.borderRadius.small};
    transition: all ${props => props.theme.transitions.fast};

    &:hover {
      transform: scale(1.05);
    }
  }

  .ant-input, .ant-select {
    border-radius: ${props => props.theme.borderRadius.small};
  }

  .ant-modal {
    .ant-modal-content {
      border-radius: ${props => props.theme.borderRadius.medium};
    }
  }

  .ant-table {
    border-radius: ${props => props.theme.borderRadius.medium};
    overflow: hidden;
  }

  .ant-tabs {
    .ant-tabs-nav {
      &::before {
        border-bottom-color: ${props => props.theme.colors.border};
      }
    }
  }

  .ant-form-item-label > label {
    font-family: ${props => props.theme.fonts.kawaii};
  }

  .ant-message-notice-content {
    border-radius: ${props => props.theme.borderRadius.medium};
    box-shadow: ${props => props.theme.shadows.medium};
  }

  .ant-tooltip {
    .ant-tooltip-inner {
      border-radius: ${props => props.theme.borderRadius.small};
    }
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.secondary};
    border-radius: ${props => props.theme.borderRadius.round};

    &:hover {
      background: ${props => props.theme.colors.primary};
    }
  }
`; 