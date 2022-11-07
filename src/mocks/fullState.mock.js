export const fullStateMock = {
  router: {
    location: {
      pathname: '/campaigns/31/members/2',
      search: '',
      hash: '',
      key: '102bv3',
    },
    action: 'PUSH',
  },
  dashboard: {
    overview: {
      errors: {},
      kpi: {
        created: 0,
        booked: 0,
        sent: 0,
        delivered: 0,
        viewed: 0,
        accepted: 0,
        sentToView: 0,
        sentToBooked: 0,
        viewToBooked: 0,
      },
      statuses: {
        giftsCreated: 0,
        giftsProposed: 0,
        inviteInTransit: 0,
        inviteDelivered: 0,
        inviteBounced: 0,
        inviteViewed: 0,
        inviteExpired: 0,
        giftsAccepted: 0,
        giftsDeclined: 0,
        meetingBooked: 0,
        meetingNotHold: 0,
      },
      downloadReportLink: 'http://alyce.site/enterprise/report/gift_statuses?team_id=1',
      isLoading: false,
      isReportLoading: false,
    },
    breakdowns: {
      teams: {
        breakdown: [
          {
            id: 1,
            name: 'WEX',
            giftsSent: 20,
            giftsViewed: '5 (25%)',
            giftsAccepted: '3 (60%)',
            meetingsBooked: '2 (67%)',
          },
        ],
        isLoading: false,
        isReportLoading: false,
        error: null,
      },
      teamMembers: {
        breakdown: [
          {
            avatar: 'https://s3.amazonaws.com/cdn-dev.alyce.co/images/users/u2_33201.jpg',
            id: 2,
            firstName: 'Greg',
            lastName: 'Segall',
            giftsSent: 0,
            giftsViewed: '0 (0%)',
            giftsAccepted: '0 (0%)',
            meetingsBooked: '0 (0%)',
          },
          {
            avatar: 'http://alyce.site/images/avatar.png',
            id: 13,
            firstName: 'Valentin',
            lastName: 'Belorustcev',
            giftsSent: 0,
            giftsViewed: '0 (0%)',
            giftsAccepted: '0 (0%)',
            meetingsBooked: '0 (0%)',
          },
          {
            avatar: 'https://s3.amazonaws.com/cdn-dev.alyce.co/images/users/u763_33968.jpg',
            id: 763,
            firstName: 'Ryan',
            lastName: 'eckenrode',
            giftsSent: 0,
            giftsViewed: '0 (0%)',
            giftsAccepted: '0 (0%)',
            meetingsBooked: '0 (0%)',
          },
          {
            avatar: 'http://alyce.site/images/avatar.png',
            id: 1045,
            firstName: 'Super',
            lastName: 'Admin',
            giftsSent: 3,
            giftsViewed: '1 (33%)',
            giftsAccepted: '0 (0%)',
            meetingsBooked: '0 (0%)',
          },
          {
            avatar: 'http://alyce.site/images/avatar.png',
            id: 1046,
            firstName: 'Simple',
            lastName: 'Gifter',
            giftsSent: 0,
            giftsViewed: '0 (0%)',
            giftsAccepted: '0 (0%)',
            meetingsBooked: '0 (0%)',
          },
          {
            avatar: 'http://alyce.site/images/avatar.png',
            id: 1210,
            firstName: 'Shyanne',
            lastName: 'Borer',
            giftsSent: 0,
            giftsViewed: '0 (0%)',
            giftsAccepted: '0 (0%)',
            meetingsBooked: '0 (0%)',
          },
          {
            avatar: 'https://s3.amazonaws.com/cdn-dev.alyce.co/images/users/u687_33876.jpg',
            id: 687,
            firstName: 'Durjoy',
            lastName: 'Bhattacharjya',
            giftsSent: 0,
            giftsViewed: '0 (0%)',
            giftsAccepted: '0 (0%)',
            meetingsBooked: '0 (0%)',
          },
          {
            avatar: 'https://s3.amazonaws.com/cdn-dev.alyce.co/images/users/u3_33202.jpg',
            id: 3,
            firstName: 'Andres',
            lastName: 'Alayza',
            giftsSent: 0,
            giftsViewed: '0 (0%)',
            giftsAccepted: '0 (0%)',
            meetingsBooked: '0 (0%)',
          },
          {
            avatar: 'https://s3.amazonaws.com/cdn-dev.alyce.co/images/users/u652_33841.jpg',
            id: 652,
            firstName: 'Scott',
            lastName: 'Davis',
            giftsSent: 0,
            giftsViewed: '0 (0%)',
            giftsAccepted: '0 (0%)',
            meetingsBooked: '0 (0%)',
          },
          {
            avatar: 'http://alyce.site/images/avatar.png',
            id: 544,
            firstName: 'Chris',
            lastName: 'Swenor',
            giftsSent: 0,
            giftsViewed: '0 (0%)',
            giftsAccepted: '0 (0%)',
            meetingsBooked: '0 (0%)',
          },
          {
            avatar: 'https://s3.amazonaws.com/cdn-dev.alyce.co/images/users/u54_33249.jpg',
            id: 54,
            firstName: 'Greg',
            lastName: 'Mills',
            giftsSent: 0,
            giftsViewed: '0 (0%)',
            giftsAccepted: '0 (0%)',
            meetingsBooked: '0 (0%)',
          },
        ],
        isLoading: false,
        isReportLoading: false,
        error: null,
      },
      gift: {
        breakdown: [
          {
            id: 1976,
            recipientId: 1428,
            avatar: '',
            firstName: 'John',
            lastName: 'Smith',
            company: '',
            gift: '',
            campaign: 'One-off gift',
            sentBy: 'Super A.',
            method: 'email',
            sentOn: '',
            giftStatus: 'Options ready',
            giftStatusId: 20,
            canChooseOptions: false,
          },
        ],
        isLoading: false,
        isReportLoading: false,
        error: null,
      },
      campaigns: {
        breakdown: [
          {
            id: 31,
            name: 'campaign 4 test',
            team_id: 1,
            giftsSent: 3,
            giftsViewed: '1 (33%)',
            giftsAccepted: '0 (0%)',
            meetingsBooked: '0 (0%)',
          },
          {
            id: 42,
            name: 'empty campaign',
            team_id: 1,
            giftsSent: 0,
            giftsViewed: '0 (0%)',
            giftsAccepted: '0 (0%)',
            meetingsBooked: '0 (0%)',
          },
          {
            id: 45,
            name: 'campaign',
            team_id: 1,
            giftsSent: 1,
            giftsViewed: '0 (0%)',
            giftsAccepted: '0 (0%)',
            meetingsBooked: '0 (0%)',
          },
          {
            id: 20,
            name: 'campaign 2 modified2',
            team_id: 7,
            giftsSent: 0,
            giftsViewed: '0 (0%)',
            giftsAccepted: '0 (0%)',
            meetingsBooked: '0 (0%)',
          },
        ],
        isLoading: false,
        isReportLoading: false,
        error: null,
      },
      contacts: {
        breakdown: [],
        isLoading: false,
        isReportLoading: false,
        error: null,
      },
    },
    members: {
      members: [
        {
          avatar: 'https://s3.amazonaws.com/cdn-dev.alyce.co/images/users/u2_33201.jpg',
          id: 2,
          fullName: 'Greg Segall',
          email: 'greg@alyce.com',
        },
        {
          avatar: 'https://s3.amazonaws.com/cdn-dev.alyce.co/images/users/u3_33202.jpg',
          id: 3,
          fullName: 'Andres Alayza',
          email: 'andres@alyce.co',
        },
        {
          avatar: 'http://alyce.site/images/avatar.png',
          id: 13,
          fullName: 'Valentin Belorustcev',
          email: 'asterix78rus@gmail.com',
        },
        {
          avatar: 'https://s3.amazonaws.com/cdn-dev.alyce.co/images/users/u54_33249.jpg',
          id: 54,
          fullName: 'Greg Mills',
          email: 'gregory.mills@gmail.com',
        },
        {
          avatar: 'http://alyce.site/images/avatar.png',
          id: 544,
          fullName: 'Chris Swenor',
          email: 'chris@eastcoastproduct.com',
        },
        {
          avatar: 'https://s3.amazonaws.com/cdn-dev.alyce.co/images/users/u652_33841.jpg',
          id: 652,
          fullName: 'Scott Davis',
          email: 'scott.h.davis@gmail.com',
        },
        {
          avatar: 'https://s3.amazonaws.com/cdn-dev.alyce.co/images/users/u687_33876.jpg',
          id: 687,
          fullName: 'Durjoy Bhattacharjya',
          email: 'durjoy@gmail.com',
        },
        {
          avatar: 'https://s3.amazonaws.com/cdn-dev.alyce.co/images/users/u763_33968.jpg',
          id: 763,
          fullName: 'Ryan eckenrode',
          email: 'ryan@alyce.com',
        },
        {
          avatar: 'http://alyce.site/images/avatar.png',
          id: 1045,
          fullName: 'Super Admin',
          email: 'admin@gmail.com',
        },
        {
          avatar: 'http://alyce.site/images/avatar.png',
          id: 1046,
          fullName: 'Simple Gifter',
          email: 'gifter@gmail.com',
        },
        {
          avatar: 'http://alyce.site/images/avatar.png',
          id: 1210,
          fullName: 'Shyanne Borer',
          email: 'hammes.earlene@hotmail.com',
        },
      ],
      isLoading: false,
      error: null,
    },
  },
  teams: {
    teams: [
      {
        id: 1,
        name: 'WEX: sales dep',
      },
      {
        id: 7,
        name: 'Prof. Xander Bartell Sr.',
      },
    ],
    isLoading: false,
    error: null,
  },
  campaigns: {
    campaigns: [
      {
        id: 31,
        name: 'campaign 4 test',
        team_id: 1,
      },
      {
        id: 42,
        name: 'empty campaign',
        team_id: 1,
      },
      {
        id: 45,
        name: 'campaign',
        team_id: 1,
      },
      {
        id: 20,
        name: 'campaign 2 modified2',
        team_id: 7,
      },
    ],
    isLoading: false,
    error: null,
  },
  user: {
    id: 1045,
    firstName: 'Super',
    lastName: 'Admin',
    orgId: 1,
    avatar: 'http://alyce.site/images/avatar.png',
    isLoading: false,
    error: null,
  },
  auth: {
    request: {
      authenticated: true,
      errors: {},
      loading: false,
    },
    userInfo: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      title: '',
    },
  },
};
