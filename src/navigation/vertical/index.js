const navigation = () => {
  return [
    {
      title: 'Home',
      path: '/home',
      icon: 'tabler:smart-home'
    },
    {
      sectionTitle: 'Misc'
    },
    {
      title: 'Site Management',
      icon: 'tabler:table',
      children: [
        {
          title: 'FAQs Setting',
          children: [
            {
              title: 'FAQs Category',
              path: '/misc/faq-category'
            },
            {
              title: 'FAQs List',
              path: '/misc/faq-list'
            }
          ]
        }
      ]
    },
    {
      title: 'FAQs',
      path: '/misc/faqs',
      icon: 'tabler:info-circle'
    },
    {
      title: 'Debugging',
      path: '/misc/debugging',
      icon: 'tabler:code'
    },
    {
      title: 'Popup',
      path: '/misc/popup',
      icon: 'tabler:code'
    }
    // {
    //   path: '/acl',
    //   action: 'read',
    //   subject: 'acl-page',
    //   title: 'Access Control',
    //   icon: 'tabler:shield'
    // }
  ]
}

export default navigation
