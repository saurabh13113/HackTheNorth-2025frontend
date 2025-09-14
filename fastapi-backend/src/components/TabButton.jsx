const TabButton = ({ active, onClick, children, icon: Icon }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
        ${active
          ? 'bg-accent-primary text-white shadow-sm'
          : 'text-secondary hover:text-primary hover:bg-tertiary'
        }
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default TabButton;