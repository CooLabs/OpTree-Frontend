/** @format */
import { Suspense } from 'react';
import { Route, useLocation } from 'react-router-dom';
import './index.less';
import { Layout, Spin } from 'antd';
//import Footer from '@/components/footer';
import { observer } from 'mobx-react';
import { Profile, useUserProfilesQuery } from '@/lens';
import { useAccount } from 'wagmi';
import useIsMounted from '@/utils/hooks/useIsMounted';
import useAuthPersistStore from '@/lib/store/auth';
import useChannelStore from '@/lib/store/channel';
import usePersistStore from '@/lib/store/persist';

const { Content } = Layout;

/**
 *
 * @param {component} props
 * @returns
 */
const LayoutRouter = (props: any) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { component: Com, auth, name, ...rest } = props;
  const setUserSigNonce = useChannelStore((state) => state.setUserSigNonce)
  const setChannels = useChannelStore((state) => state.setChannels)
  const setSelectedChannel = useChannelStore(
    (state) => state.setSelectedChannel
  )
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )
  const setSelectedChannelId = useAuthPersistStore(
    (state) => state.setSelectedChannelId
  )

  const { mounted } = useIsMounted()
  const { address } = useAccount()

 
  const setUserChannels = (channels: Profile[]) => {
    setChannels(channels)
    const channel = channels.find((ch) => ch.id === selectedChannelId)
    setSelectedChannel(channel ?? channels[0])
    setSelectedChannelId(channel?.id)
  }

  const resetAuthState = () => {
    setSelectedChannel(null)
    setSelectedChannelId(null)
  }

  const { loading } = useUserProfilesQuery({
    variables: {
      request: { ownedBy: [address] }
    },
    skip: !selectedChannelId,
    onCompleted: (data) => {
      const channels = data?.profiles?.items as Profile[]
      if (!channels.length) {
        return resetAuthState()
      }
      setUserChannels(channels)
      setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce)
    },
    onError: () => {
      setSelectedChannelId(null)
    }
  })


  const isShowFooter = () => {
    const paths = ['/collections/tokens/', '/tokens/', '/profiles/'];
    for (let item of paths) {
      if (pathname.startsWith(item)) return false;
    }
    return true;
  };

  return (
    <Layout className="optree-content">
      <Content>
        <Suspense
          fallback={
            <div
              style={{
                height: 'calc(100vh - @content-paddingTop)',
                width: '100%',
                background: '#fff',
              }}
            >
              <Spin
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
          }
        >
          <Route
            {...rest}
            render={(props: any) => {
              return <Com {...props} />;
            }}
          />
        </Suspense>
      </Content>
      {/* {isShowFooter() && (
        <Layout.Footer>
           <Footer /> 
        </Layout.Footer>
      )} */}
    </Layout>
  );
};

export default observer(LayoutRouter);
