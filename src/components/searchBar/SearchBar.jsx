import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import styles from './SearchBar.module.scss'
import classNames from "classnames/bind"

const cx = classNames.bind(styles)

const SearchBar = () => {
    const [input, setInput] = useState("")

    const handleChangeInput = (e) => {
        setInput(e.target.value)
    }
  return (
    <div className={cx("input-wrapper")}>
        <FaSearch id="search-icon" />
        <input placeholder='Type to search...' value={input} onChange={handleChangeInput} />
    </div>
  )
}

export default SearchBar