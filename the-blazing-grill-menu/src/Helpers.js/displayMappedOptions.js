const MappedOptions = ({ optionsData, menu, setMenu }) => {
  return (
    <>
      {optionsData.map((opt) => (
        <div
          style={
            menu !== null && menu.name === opt.name ? { color: "#f7941d" } : {}
          }
          onClick={(e) => setMenu({ ...opt, selected: true })}
          className="menuAndEditViewOptionsItem"
        >
          {opt.name}
        </div>
      ))}
    </>
  );
};

export default MappedOptions;
