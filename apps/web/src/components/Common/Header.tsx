import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React from 'react'
import { LOGO_ASSETS, STATIC_ASSETS } from 'utils'

import Login from './Auth/Login'
import { Trans } from '@lingui/macro'

type Props = {
  className?: string
}

const Header: FC<Props> = ({ className }) => {
  const { pathname } = useRouter()
  const showFilter = pathname === '/' || pathname === '/explore'

  return (
    <div
      className={clsx(
        'dark:bg-theme sticky left-0 right-0 top-0 z-10 flex w-full items-center bg-white py-2.5',
        className
      )}
    >
      <div className="w-full">
        <div className="ultrawide:px-6 flex w-full items-center justify-between px-2">
          <div className="md:w-[330px]">
            <Link href="/" className="block md:invisible">
              <img
                src={`${LOGO_ASSETS}`}
                draggable={false}
                className="h-5 w-5"
                alt="optree"
              />
            </Link>
          </div>
          <div className="flex flex-row items-center justify-end space-x-2 md:w-96 md:space-x-3">
            <Link
                href="/"
                className="flex md:w-[100px] flex-col  justify-center rounded-lg bg-transparent pt-2 text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid"
              >
              <span className="text-[18px]">
                <Trans>Home</Trans>
              </span>
            </Link>
            <Link
              href="/explore"
              className="flex md:w-[100px] flex-col justify-center rounded-lg bg-transparent pt-2 text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid"
            >
              <span className="text-[18px]">
                <Trans>Explore</Trans>
              </span>
            </Link>
            <Login />

          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
