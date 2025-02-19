import { LibraryProvider } from './LibraryContext';
import { UIProvider } from './UIContext';

const RootProvider = ({ children }) => {
  return (
    <UIProvider>
      <LibraryProvider>
        {children}
      </LibraryProvider>
    </UIProvider>
  );
};

export default RootProvider;