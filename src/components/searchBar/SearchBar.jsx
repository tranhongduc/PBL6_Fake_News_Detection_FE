import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import styles from './SearchBar.module.scss'
import classNames from "classnames/bind"

const cx = classNames.bind(styles)

const SearchBar = ({ input, handleChangeInput }) => {
  const onChange = (e) => {
    handleChangeInput(e.target.value)
  }
  return (
    <div className={cx("input-wrapper")}>
        <FaSearch id="search-icon" />
        <input placeholder='Type to search...' value={input} onChange={onChange} />
    </div>
  )
}

export default SearchBar