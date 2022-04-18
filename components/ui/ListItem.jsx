import React from "react";
import PropTypes from "prop-types";

function ListItem({ children }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        width={24}
        height={24}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 6H13V10.079L16.3413 7.73938L17.4885 9.37768L13.7434 12L17.4885 14.6223L16.3413 16.2606L13 13.921V18H11V13.921L7.65864 16.2606L6.51148 14.6223L10.2565 12L6.51147 9.37769L7.65863 7.73938L11 10.079V6Z"
          fill="currentColor"
        />
      </svg>
      <p className="text-sm">{children}</p>
    </div>
  );
}

ListItem.propTypes = {
  children: PropTypes.any.isRequired,
};

export default ListItem;
