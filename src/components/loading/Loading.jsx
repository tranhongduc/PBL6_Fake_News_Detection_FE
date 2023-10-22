import React, { useState, useEffect } from 'react'
import styles from './Loading.module.scss'
import classNames from "classnames/bind"
import { GridLoader } from 'react-spinners'

const cx = classNames.bind(styles)

const Loading = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false)
    }, 5000)
  }, [])

  if (loading) {
    return (
      <div className={cx("loading-wrapper")}>
        <GridLoader
          size={50}
          color={'#8DD3BB'}
          loading={loading}
          speedMultiplier={2}
        />
      </div>
    )
  }
}

export default Loading