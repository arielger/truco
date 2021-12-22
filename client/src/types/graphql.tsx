// prettier-ignore
/* eslint-disable */
import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};


export type Action = {
  playerId: Scalars['ID'];
  type: Scalars['String'];
  points?: Maybe<Scalars['Int']>;
};

export type AuthResponse = {
  token: Scalars['String'];
  user: User;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type Card = {
  id: Scalars['ID'];
  card: Scalars['String'];
  played: Scalars['Boolean'];
};

export type CardsByPlayer = {
  playerId: Scalars['ID'];
  cards: Array<Scalars['String']>;
};

export type Envido = {
  list: Array<Maybe<EnvidoType>>;
  status: EnvidoStatus;
  team: Team;
};

export enum EnvidoActions {
  Envido = 'ENVIDO',
  RealEnvido = 'REAL_ENVIDO',
  FaltaEnvido = 'FALTA_ENVIDO',
  Accept = 'ACCEPT',
  Reject = 'REJECT'
}

export enum EnvidoStatus {
  Pending = 'PENDING',
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED'
}

export enum EnvidoType {
  Envido = 'ENVIDO',
  RealEnvido = 'REAL_ENVIDO',
  FaltaEnvido = 'FALTA_ENVIDO'
}

export type Match = {
  id: Scalars['ID'];
  status: MatchStatus;
  playersCount: Scalars['Int'];
  points: Scalars['Int'];
  creator: Player;
  players: Array<Player>;
};

export type MatchListUpdate = {
  type: MatchListUpdateType;
  id: Scalars['ID'];
  status: MatchStatus;
  playersCount: Scalars['Int'];
  points: Scalars['Int'];
  creator: Player;
  players: Array<Player>;
};

export enum MatchListUpdateType {
  MatchAdded = 'MATCH_ADDED',
  MatchUpdated = 'MATCH_UPDATED',
  MatchRemoved = 'MATCH_REMOVED'
}

export enum MatchStatus {
  Waiting = 'waiting',
  Playing = 'playing',
  Finished = 'finished'
}

export type MatchUpdate = {
  type?: Maybe<MatchUpdateType>;
  id: Scalars['ID'];
  status: MatchStatus;
  playersCount: Scalars['Int'];
  points: Scalars['Int'];
  creator: Player;
  players: Array<Player>;
  myCards: Array<Card>;
  nextPlayer?: Maybe<Scalars['ID']>;
  isLastPlayerFromTeam?: Maybe<Scalars['Boolean']>;
  cardsPlayedByPlayer: Array<CardsByPlayer>;
  roundWinnerTeam?: Maybe<Team>;
  matchWinnerTeam?: Maybe<Team>;
  myPoints: Scalars['Int'];
  theirPoints: Scalars['Int'];
  truco?: Maybe<Truco>;
  envido?: Maybe<Envido>;
  /** ID of the player who should say their envido points next */
  nextPlayerEnvido?: Maybe<Scalars['ID']>;
  /** List of say envido actions (how many points each player said they have) */
  envidoPoints?: Maybe<Array<PlayerEnvidoPoints>>;
  lastAction?: Maybe<Action>;
};

export type MatchUpdateResponse = {
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export enum MatchUpdateType {
  NewPlayer = 'NEW_PLAYER',
  PlayerLeftGame = 'PLAYER_LEFT_GAME',
  CreatorLeftGame = 'CREATOR_LEFT_GAME',
  StartGame = 'START_GAME',
  NewMove = 'NEW_MOVE',
  NewRound = 'NEW_ROUND',
  TrucoAction = 'TRUCO_ACTION',
  EnvidoAction = 'ENVIDO_ACTION'
}

export type Mutation = {
  _?: Maybe<Scalars['Boolean']>;
  logInAsGuest: AuthResponse;
  logInWithFacebook: AuthResponse;
  logInWithGoogle: AuthResponse;
  createMatch: Match;
  joinMatch: Match;
  leaveMatch: MatchUpdateResponse;
  playCard: PlayerMatch;
  playTruco: MatchUpdateResponse;
  playEnvido: MatchUpdateResponse;
  sayEnvido: MatchUpdateResponse;
  leaveRound: MatchUpdateResponse;
};


export type MutationLogInAsGuestArgs = {
  name: Scalars['String'];
};


export type MutationLogInWithFacebookArgs = {
  accessToken: Scalars['String'];
};


export type MutationLogInWithGoogleArgs = {
  accessToken: Scalars['String'];
};


export type MutationCreateMatchArgs = {
  playersCount: Scalars['Int'];
  points: Scalars['Int'];
};


export type MutationJoinMatchArgs = {
  matchId: Scalars['ID'];
};


export type MutationLeaveMatchArgs = {
  matchId: Scalars['ID'];
};


export type MutationPlayCardArgs = {
  matchId: Scalars['ID'];
  cardId: Scalars['ID'];
};


export type MutationPlayTrucoArgs = {
  matchId: Scalars['ID'];
  action: TrucoActions;
};


export type MutationPlayEnvidoArgs = {
  matchId: Scalars['ID'];
  action: EnvidoActions;
};


export type MutationSayEnvidoArgs = {
  matchId: Scalars['ID'];
  action: SayEnvidoActions;
};


export type MutationLeaveRoundArgs = {
  matchId: Scalars['ID'];
};

export type Player = {
  id: Scalars['ID'];
  name: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
  isFromFirstTeam?: Maybe<Scalars['Boolean']>;
};

export type PlayerEnvidoPoints = {
  playerId: Scalars['ID'];
  moveType: SayEnvidoMoveType;
  team: Team;
  points?: Maybe<Scalars['Int']>;
};

export type PlayerMatch = {
  id: Scalars['ID'];
  status: MatchStatus;
  playersCount: Scalars['Int'];
  points: Scalars['Int'];
  creator: Player;
  players: Array<Player>;
  myCards: Array<Card>;
  nextPlayer?: Maybe<Scalars['ID']>;
  isLastPlayerFromTeam?: Maybe<Scalars['Boolean']>;
  cardsPlayedByPlayer: Array<CardsByPlayer>;
  roundWinnerTeam?: Maybe<Team>;
  matchWinnerTeam?: Maybe<Team>;
  myPoints: Scalars['Int'];
  theirPoints: Scalars['Int'];
  truco?: Maybe<Truco>;
  envido?: Maybe<Envido>;
  /** ID of the player who should say their envido points next */
  nextPlayerEnvido?: Maybe<Scalars['ID']>;
  /** List of say envido actions (how many points each player said they have) */
  envidoPoints?: Maybe<Array<PlayerEnvidoPoints>>;
  lastAction?: Maybe<Action>;
};

/**
 * There should be at lest one field in each type
 * https://github.com/graphql/graphql-js/issues/937
 */
export type Query = {
  _?: Maybe<Scalars['Boolean']>;
  match: PlayerMatch;
  matches: Array<Match>;
  token?: Maybe<Scalars['String']>;
  user: User;
};


/**
 * There should be at lest one field in each type
 * https://github.com/graphql/graphql-js/issues/937
 */
export type QueryMatchArgs = {
  id: Scalars['ID'];
};

export enum SayEnvidoActions {
  Table = 'TABLE',
  Points = 'POINTS',
  CantWin = 'CANT_WIN',
  NAreMore = 'N_ARE_MORE'
}

export enum SayEnvidoMoveType {
  Points = 'POINTS',
  CantWin = 'CANT_WIN'
}

export type Subscription = {
  _?: Maybe<Scalars['Boolean']>;
  matchListUpdated: MatchListUpdate;
  matchUpdated: MatchUpdate;
};


export type SubscriptionMatchUpdatedArgs = {
  matchId: Scalars['ID'];
};

export enum Team {
  We = 'we',
  Them = 'them'
}

export type Truco = {
  type: TrucoType;
  status: TrucoStatus;
  team: Team;
  hand: Scalars['Int'];
};

export enum TrucoActions {
  Truco = 'TRUCO',
  Retruco = 'RETRUCO',
  ValeCuatro = 'VALE_CUATRO',
  Accept = 'ACCEPT',
  Reject = 'REJECT'
}

export enum TrucoStatus {
  Pending = 'PENDING',
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED'
}

export enum TrucoType {
  Truco = 'TRUCO',
  Retruco = 'RETRUCO',
  ValeCuatro = 'VALE_CUATRO'
}


export type User = {
  avatar?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Unnamed_1_QueryVariables = Exact<{ [key: string]: never; }>;


export type Unnamed_1_Query = (
  Pick<Query, 'token'>
  & { user: Pick<User, 'id' | 'name' | 'email' | 'avatar'> }
);

export type FetchProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchProfileQuery = { user: Pick<User, 'id' | 'name' | 'avatar'> };

export type FetchLocalProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchLocalProfileQuery = (
  Pick<Query, 'token'>
  & { user: Pick<User, 'id' | 'name' | 'avatar'> }
);

export type LogInAsGuestMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type LogInAsGuestMutation = { logInAsGuest: (
    Pick<AuthResponse, 'token'>
    & { user: Pick<User, 'id' | 'name'> }
  ) };

export type LogInWithFacebookMutationVariables = Exact<{
  accessToken: Scalars['String'];
}>;


export type LogInWithFacebookMutation = { logInWithFacebook: (
    Pick<AuthResponse, 'token'>
    & { user: Pick<User, 'id' | 'name' | 'avatar'> }
  ) };

export type LogInWithGoogleMutationVariables = Exact<{
  accessToken: Scalars['String'];
}>;


export type LogInWithGoogleMutation = { logInWithGoogle: (
    Pick<AuthResponse, 'token'>
    & { user: Pick<User, 'id' | 'name' | 'avatar'> }
  ) };

export type SetLoggedInUserQueryVariables = Exact<{ [key: string]: never; }>;


export type SetLoggedInUserQuery = (
  Pick<Query, 'token'>
  & { user: Pick<User, 'id' | 'name' | 'avatar'> }
);

export type PlayTrucoMutationVariables = Exact<{
  matchId: Scalars['ID'];
  action: TrucoActions;
}>;


export type PlayTrucoMutation = { playTruco: Pick<MatchUpdateResponse, 'success' | 'message'> };

export type PlayEnvidoMutationVariables = Exact<{
  matchId: Scalars['ID'];
  action: EnvidoActions;
}>;


export type PlayEnvidoMutation = { playEnvido: Pick<MatchUpdateResponse, 'success' | 'message'> };

export type SayEnvidoMutationVariables = Exact<{
  matchId: Scalars['ID'];
  action: SayEnvidoActions;
}>;


export type SayEnvidoMutation = { sayEnvido: Pick<MatchUpdateResponse, 'success' | 'message'> };

export type LeaveRoundMutationVariables = Exact<{
  matchId: Scalars['ID'];
}>;


export type LeaveRoundMutation = { leaveRound: Pick<MatchUpdateResponse, 'success' | 'message'> };

export type FetchMatchQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type FetchMatchQuery = { match: (
    Pick<PlayerMatch, 'id' | 'status' | 'playersCount' | 'points' | 'nextPlayer' | 'isLastPlayerFromTeam' | 'myPoints' | 'theirPoints' | 'roundWinnerTeam' | 'matchWinnerTeam' | 'nextPlayerEnvido'>
    & { creator: Pick<Player, 'id' | 'name' | 'avatar'>, players: Array<Pick<Player, 'id' | 'name' | 'avatar' | 'isFromFirstTeam'>>, myCards: Array<Pick<Card, 'id' | 'card' | 'played'>>, cardsPlayedByPlayer: Array<Pick<CardsByPlayer, 'playerId' | 'cards'>>, truco?: Maybe<Pick<Truco, 'type' | 'status' | 'team' | 'hand'>>, envido?: Maybe<Pick<Envido, 'list' | 'status' | 'team'>>, envidoPoints?: Maybe<Array<Pick<PlayerEnvidoPoints, 'playerId' | 'moveType' | 'points' | 'team'>>>, lastAction?: Maybe<Pick<Action, 'playerId' | 'type' | 'points'>> }
  ) };

export type MatchUpdatedSubscriptionVariables = Exact<{
  matchId: Scalars['ID'];
}>;


export type MatchUpdatedSubscription = { matchUpdated: (
    Pick<MatchUpdate, 'id' | 'type' | 'status' | 'playersCount' | 'points' | 'nextPlayer' | 'isLastPlayerFromTeam' | 'myPoints' | 'theirPoints' | 'roundWinnerTeam' | 'matchWinnerTeam' | 'nextPlayerEnvido'>
    & { creator: Pick<Player, 'id' | 'name' | 'avatar'>, players: Array<Pick<Player, 'id' | 'name' | 'avatar' | 'isFromFirstTeam'>>, myCards: Array<Pick<Card, 'id' | 'card' | 'played'>>, cardsPlayedByPlayer: Array<Pick<CardsByPlayer, 'playerId' | 'cards'>>, truco?: Maybe<Pick<Truco, 'type' | 'status' | 'team' | 'hand'>>, envido?: Maybe<Pick<Envido, 'list' | 'status' | 'team'>>, envidoPoints?: Maybe<Array<Pick<PlayerEnvidoPoints, 'playerId' | 'moveType' | 'points' | 'team'>>>, lastAction?: Maybe<Pick<Action, 'playerId' | 'type' | 'points'>> }
  ) };

export type JoinMatchMutationVariables = Exact<{
  matchId: Scalars['ID'];
}>;


export type JoinMatchMutation = { joinMatch: Pick<Match, 'id'> };

export type LeaveMatchMutationVariables = Exact<{
  matchId: Scalars['ID'];
}>;


export type LeaveMatchMutation = { leaveMatch: Pick<MatchUpdateResponse, 'success' | 'message'> };

export type PlayCardMutationVariables = Exact<{
  matchId: Scalars['ID'];
  cardId: Scalars['ID'];
}>;


export type PlayCardMutation = { playCard: { myCards: Array<Pick<Card, 'id' | 'card' | 'played'>>, cardsPlayedByPlayer: Array<Pick<CardsByPlayer, 'playerId' | 'cards'>> } };

export type FetchMatchesQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchMatchesQuery = { matches: Array<(
    Pick<Match, 'id' | 'playersCount' | 'points'>
    & { creator: Pick<Player, 'name' | 'avatar'>, players: Array<Pick<Player, 'name' | 'avatar'>> }
  )> };

export type SubscribeNewMatchesSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeNewMatchesSubscription = { matchListUpdated: (
    Pick<MatchListUpdate, 'type' | 'id' | 'playersCount' | 'points'>
    & { creator: Pick<Player, 'name' | 'avatar'>, players: Array<Pick<Player, 'name' | 'avatar'>> }
  ) };

export type CreateMatchMutationVariables = Exact<{
  playersCount: Scalars['Int'];
  points: Scalars['Int'];
}>;


export type CreateMatchMutation = { createMatch: Pick<Match, 'id'> };


export const FetchProfileDocument = gql`
    query fetchProfile {
  user {
    id
    name
    avatar
  }
}
    `;

/**
 * __useFetchProfileQuery__
 *
 * To run a query within a React component, call `useFetchProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useFetchProfileQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FetchProfileQuery, FetchProfileQueryVariables>) {
        return ApolloReactHooks.useQuery<FetchProfileQuery, FetchProfileQueryVariables>(FetchProfileDocument, baseOptions);
      }
export function useFetchProfileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FetchProfileQuery, FetchProfileQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<FetchProfileQuery, FetchProfileQueryVariables>(FetchProfileDocument, baseOptions);
        }
export type FetchProfileQueryHookResult = ReturnType<typeof useFetchProfileQuery>;
export type FetchProfileLazyQueryHookResult = ReturnType<typeof useFetchProfileLazyQuery>;
export type FetchProfileQueryResult = ApolloReactCommon.QueryResult<FetchProfileQuery, FetchProfileQueryVariables>;
export const FetchLocalProfileDocument = gql`
    query fetchLocalProfile {
  user @client {
    id
    name
    avatar
  }
  token @client
}
    `;

/**
 * __useFetchLocalProfileQuery__
 *
 * To run a query within a React component, call `useFetchLocalProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchLocalProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchLocalProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useFetchLocalProfileQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FetchLocalProfileQuery, FetchLocalProfileQueryVariables>) {
        return ApolloReactHooks.useQuery<FetchLocalProfileQuery, FetchLocalProfileQueryVariables>(FetchLocalProfileDocument, baseOptions);
      }
export function useFetchLocalProfileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FetchLocalProfileQuery, FetchLocalProfileQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<FetchLocalProfileQuery, FetchLocalProfileQueryVariables>(FetchLocalProfileDocument, baseOptions);
        }
export type FetchLocalProfileQueryHookResult = ReturnType<typeof useFetchLocalProfileQuery>;
export type FetchLocalProfileLazyQueryHookResult = ReturnType<typeof useFetchLocalProfileLazyQuery>;
export type FetchLocalProfileQueryResult = ApolloReactCommon.QueryResult<FetchLocalProfileQuery, FetchLocalProfileQueryVariables>;
export const LogInAsGuestDocument = gql`
    mutation LogInAsGuest($name: String!) {
  logInAsGuest(name: $name) {
    token
    user {
      id
      name
    }
  }
}
    `;
export type LogInAsGuestMutationFn = ApolloReactCommon.MutationFunction<LogInAsGuestMutation, LogInAsGuestMutationVariables>;

/**
 * __useLogInAsGuestMutation__
 *
 * To run a mutation, you first call `useLogInAsGuestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogInAsGuestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logInAsGuestMutation, { data, loading, error }] = useLogInAsGuestMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useLogInAsGuestMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogInAsGuestMutation, LogInAsGuestMutationVariables>) {
        return ApolloReactHooks.useMutation<LogInAsGuestMutation, LogInAsGuestMutationVariables>(LogInAsGuestDocument, baseOptions);
      }
export type LogInAsGuestMutationHookResult = ReturnType<typeof useLogInAsGuestMutation>;
export type LogInAsGuestMutationResult = ApolloReactCommon.MutationResult<LogInAsGuestMutation>;
export type LogInAsGuestMutationOptions = ApolloReactCommon.BaseMutationOptions<LogInAsGuestMutation, LogInAsGuestMutationVariables>;
export const LogInWithFacebookDocument = gql`
    mutation LogInWithFacebook($accessToken: String!) {
  logInWithFacebook(accessToken: $accessToken) {
    token
    user {
      id
      name
      avatar
    }
  }
}
    `;
export type LogInWithFacebookMutationFn = ApolloReactCommon.MutationFunction<LogInWithFacebookMutation, LogInWithFacebookMutationVariables>;

/**
 * __useLogInWithFacebookMutation__
 *
 * To run a mutation, you first call `useLogInWithFacebookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogInWithFacebookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logInWithFacebookMutation, { data, loading, error }] = useLogInWithFacebookMutation({
 *   variables: {
 *      accessToken: // value for 'accessToken'
 *   },
 * });
 */
export function useLogInWithFacebookMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogInWithFacebookMutation, LogInWithFacebookMutationVariables>) {
        return ApolloReactHooks.useMutation<LogInWithFacebookMutation, LogInWithFacebookMutationVariables>(LogInWithFacebookDocument, baseOptions);
      }
export type LogInWithFacebookMutationHookResult = ReturnType<typeof useLogInWithFacebookMutation>;
export type LogInWithFacebookMutationResult = ApolloReactCommon.MutationResult<LogInWithFacebookMutation>;
export type LogInWithFacebookMutationOptions = ApolloReactCommon.BaseMutationOptions<LogInWithFacebookMutation, LogInWithFacebookMutationVariables>;
export const LogInWithGoogleDocument = gql`
    mutation LogInWithGoogle($accessToken: String!) {
  logInWithGoogle(accessToken: $accessToken) {
    token
    user {
      id
      name
      avatar
    }
  }
}
    `;
export type LogInWithGoogleMutationFn = ApolloReactCommon.MutationFunction<LogInWithGoogleMutation, LogInWithGoogleMutationVariables>;

/**
 * __useLogInWithGoogleMutation__
 *
 * To run a mutation, you first call `useLogInWithGoogleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogInWithGoogleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logInWithGoogleMutation, { data, loading, error }] = useLogInWithGoogleMutation({
 *   variables: {
 *      accessToken: // value for 'accessToken'
 *   },
 * });
 */
export function useLogInWithGoogleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogInWithGoogleMutation, LogInWithGoogleMutationVariables>) {
        return ApolloReactHooks.useMutation<LogInWithGoogleMutation, LogInWithGoogleMutationVariables>(LogInWithGoogleDocument, baseOptions);
      }
export type LogInWithGoogleMutationHookResult = ReturnType<typeof useLogInWithGoogleMutation>;
export type LogInWithGoogleMutationResult = ApolloReactCommon.MutationResult<LogInWithGoogleMutation>;
export type LogInWithGoogleMutationOptions = ApolloReactCommon.BaseMutationOptions<LogInWithGoogleMutation, LogInWithGoogleMutationVariables>;
export const SetLoggedInUserDocument = gql`
    query setLoggedInUser {
  user {
    id
    name
    avatar
  }
  token
}
    `;

/**
 * __useSetLoggedInUserQuery__
 *
 * To run a query within a React component, call `useSetLoggedInUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useSetLoggedInUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSetLoggedInUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useSetLoggedInUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SetLoggedInUserQuery, SetLoggedInUserQueryVariables>) {
        return ApolloReactHooks.useQuery<SetLoggedInUserQuery, SetLoggedInUserQueryVariables>(SetLoggedInUserDocument, baseOptions);
      }
export function useSetLoggedInUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SetLoggedInUserQuery, SetLoggedInUserQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SetLoggedInUserQuery, SetLoggedInUserQueryVariables>(SetLoggedInUserDocument, baseOptions);
        }
export type SetLoggedInUserQueryHookResult = ReturnType<typeof useSetLoggedInUserQuery>;
export type SetLoggedInUserLazyQueryHookResult = ReturnType<typeof useSetLoggedInUserLazyQuery>;
export type SetLoggedInUserQueryResult = ApolloReactCommon.QueryResult<SetLoggedInUserQuery, SetLoggedInUserQueryVariables>;
export const PlayTrucoDocument = gql`
    mutation playTruco($matchId: ID!, $action: TrucoActions!) {
  playTruco(matchId: $matchId, action: $action) {
    success
    message
  }
}
    `;
export type PlayTrucoMutationFn = ApolloReactCommon.MutationFunction<PlayTrucoMutation, PlayTrucoMutationVariables>;

/**
 * __usePlayTrucoMutation__
 *
 * To run a mutation, you first call `usePlayTrucoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlayTrucoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [playTrucoMutation, { data, loading, error }] = usePlayTrucoMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *      action: // value for 'action'
 *   },
 * });
 */
export function usePlayTrucoMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PlayTrucoMutation, PlayTrucoMutationVariables>) {
        return ApolloReactHooks.useMutation<PlayTrucoMutation, PlayTrucoMutationVariables>(PlayTrucoDocument, baseOptions);
      }
export type PlayTrucoMutationHookResult = ReturnType<typeof usePlayTrucoMutation>;
export type PlayTrucoMutationResult = ApolloReactCommon.MutationResult<PlayTrucoMutation>;
export type PlayTrucoMutationOptions = ApolloReactCommon.BaseMutationOptions<PlayTrucoMutation, PlayTrucoMutationVariables>;
export const PlayEnvidoDocument = gql`
    mutation playEnvido($matchId: ID!, $action: EnvidoActions!) {
  playEnvido(matchId: $matchId, action: $action) {
    success
    message
  }
}
    `;
export type PlayEnvidoMutationFn = ApolloReactCommon.MutationFunction<PlayEnvidoMutation, PlayEnvidoMutationVariables>;

/**
 * __usePlayEnvidoMutation__
 *
 * To run a mutation, you first call `usePlayEnvidoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlayEnvidoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [playEnvidoMutation, { data, loading, error }] = usePlayEnvidoMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *      action: // value for 'action'
 *   },
 * });
 */
export function usePlayEnvidoMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PlayEnvidoMutation, PlayEnvidoMutationVariables>) {
        return ApolloReactHooks.useMutation<PlayEnvidoMutation, PlayEnvidoMutationVariables>(PlayEnvidoDocument, baseOptions);
      }
export type PlayEnvidoMutationHookResult = ReturnType<typeof usePlayEnvidoMutation>;
export type PlayEnvidoMutationResult = ApolloReactCommon.MutationResult<PlayEnvidoMutation>;
export type PlayEnvidoMutationOptions = ApolloReactCommon.BaseMutationOptions<PlayEnvidoMutation, PlayEnvidoMutationVariables>;
export const SayEnvidoDocument = gql`
    mutation sayEnvido($matchId: ID!, $action: SayEnvidoActions!) {
  sayEnvido(matchId: $matchId, action: $action) {
    success
    message
  }
}
    `;
export type SayEnvidoMutationFn = ApolloReactCommon.MutationFunction<SayEnvidoMutation, SayEnvidoMutationVariables>;

/**
 * __useSayEnvidoMutation__
 *
 * To run a mutation, you first call `useSayEnvidoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSayEnvidoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sayEnvidoMutation, { data, loading, error }] = useSayEnvidoMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *      action: // value for 'action'
 *   },
 * });
 */
export function useSayEnvidoMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SayEnvidoMutation, SayEnvidoMutationVariables>) {
        return ApolloReactHooks.useMutation<SayEnvidoMutation, SayEnvidoMutationVariables>(SayEnvidoDocument, baseOptions);
      }
export type SayEnvidoMutationHookResult = ReturnType<typeof useSayEnvidoMutation>;
export type SayEnvidoMutationResult = ApolloReactCommon.MutationResult<SayEnvidoMutation>;
export type SayEnvidoMutationOptions = ApolloReactCommon.BaseMutationOptions<SayEnvidoMutation, SayEnvidoMutationVariables>;
export const LeaveRoundDocument = gql`
    mutation leaveRound($matchId: ID!) {
  leaveRound(matchId: $matchId) {
    success
    message
  }
}
    `;
export type LeaveRoundMutationFn = ApolloReactCommon.MutationFunction<LeaveRoundMutation, LeaveRoundMutationVariables>;

/**
 * __useLeaveRoundMutation__
 *
 * To run a mutation, you first call `useLeaveRoundMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveRoundMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveRoundMutation, { data, loading, error }] = useLeaveRoundMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *   },
 * });
 */
export function useLeaveRoundMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LeaveRoundMutation, LeaveRoundMutationVariables>) {
        return ApolloReactHooks.useMutation<LeaveRoundMutation, LeaveRoundMutationVariables>(LeaveRoundDocument, baseOptions);
      }
export type LeaveRoundMutationHookResult = ReturnType<typeof useLeaveRoundMutation>;
export type LeaveRoundMutationResult = ApolloReactCommon.MutationResult<LeaveRoundMutation>;
export type LeaveRoundMutationOptions = ApolloReactCommon.BaseMutationOptions<LeaveRoundMutation, LeaveRoundMutationVariables>;
export const FetchMatchDocument = gql`
    query fetchMatch($id: ID!) {
  match(id: $id) {
    id
    status
    playersCount
    points
    creator {
      id
      name
      avatar
    }
    players {
      id
      name
      avatar
      isFromFirstTeam
    }
    myCards {
      id
      card
      played
    }
    cardsPlayedByPlayer {
      playerId
      cards
    }
    nextPlayer
    isLastPlayerFromTeam
    myPoints
    theirPoints
    roundWinnerTeam
    matchWinnerTeam
    truco {
      type
      status
      team
      hand
    }
    envido {
      list
      status
      team
    }
    nextPlayerEnvido
    envidoPoints {
      playerId
      moveType
      points
      team
    }
    lastAction {
      playerId
      type
      points
    }
  }
}
    `;

/**
 * __useFetchMatchQuery__
 *
 * To run a query within a React component, call `useFetchMatchQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchMatchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchMatchQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFetchMatchQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FetchMatchQuery, FetchMatchQueryVariables>) {
        return ApolloReactHooks.useQuery<FetchMatchQuery, FetchMatchQueryVariables>(FetchMatchDocument, baseOptions);
      }
export function useFetchMatchLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FetchMatchQuery, FetchMatchQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<FetchMatchQuery, FetchMatchQueryVariables>(FetchMatchDocument, baseOptions);
        }
export type FetchMatchQueryHookResult = ReturnType<typeof useFetchMatchQuery>;
export type FetchMatchLazyQueryHookResult = ReturnType<typeof useFetchMatchLazyQuery>;
export type FetchMatchQueryResult = ApolloReactCommon.QueryResult<FetchMatchQuery, FetchMatchQueryVariables>;
export const MatchUpdatedDocument = gql`
    subscription matchUpdated($matchId: ID!) {
  matchUpdated(matchId: $matchId) {
    id
    type
    status
    playersCount
    points
    creator {
      id
      name
      avatar
    }
    players {
      id
      name
      avatar
      isFromFirstTeam
    }
    myCards {
      id
      card
      played
    }
    cardsPlayedByPlayer {
      playerId
      cards
    }
    nextPlayer
    isLastPlayerFromTeam
    myPoints
    theirPoints
    roundWinnerTeam
    matchWinnerTeam
    truco {
      type
      status
      team
      hand
    }
    envido {
      list
      status
      team
    }
    nextPlayerEnvido
    envidoPoints {
      playerId
      moveType
      points
      team
    }
    lastAction {
      playerId
      type
      points
    }
  }
}
    `;

/**
 * __useMatchUpdatedSubscription__
 *
 * To run a query within a React component, call `useMatchUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMatchUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMatchUpdatedSubscription({
 *   variables: {
 *      matchId: // value for 'matchId'
 *   },
 * });
 */
export function useMatchUpdatedSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<MatchUpdatedSubscription, MatchUpdatedSubscriptionVariables>) {
        return ApolloReactHooks.useSubscription<MatchUpdatedSubscription, MatchUpdatedSubscriptionVariables>(MatchUpdatedDocument, baseOptions);
      }
export type MatchUpdatedSubscriptionHookResult = ReturnType<typeof useMatchUpdatedSubscription>;
export type MatchUpdatedSubscriptionResult = ApolloReactCommon.SubscriptionResult<MatchUpdatedSubscription>;
export const JoinMatchDocument = gql`
    mutation joinMatch($matchId: ID!) {
  joinMatch(matchId: $matchId) {
    id
  }
}
    `;
export type JoinMatchMutationFn = ApolloReactCommon.MutationFunction<JoinMatchMutation, JoinMatchMutationVariables>;

/**
 * __useJoinMatchMutation__
 *
 * To run a mutation, you first call `useJoinMatchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinMatchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinMatchMutation, { data, loading, error }] = useJoinMatchMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *   },
 * });
 */
export function useJoinMatchMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<JoinMatchMutation, JoinMatchMutationVariables>) {
        return ApolloReactHooks.useMutation<JoinMatchMutation, JoinMatchMutationVariables>(JoinMatchDocument, baseOptions);
      }
export type JoinMatchMutationHookResult = ReturnType<typeof useJoinMatchMutation>;
export type JoinMatchMutationResult = ApolloReactCommon.MutationResult<JoinMatchMutation>;
export type JoinMatchMutationOptions = ApolloReactCommon.BaseMutationOptions<JoinMatchMutation, JoinMatchMutationVariables>;
export const LeaveMatchDocument = gql`
    mutation leaveMatch($matchId: ID!) {
  leaveMatch(matchId: $matchId) {
    success
    message
  }
}
    `;
export type LeaveMatchMutationFn = ApolloReactCommon.MutationFunction<LeaveMatchMutation, LeaveMatchMutationVariables>;

/**
 * __useLeaveMatchMutation__
 *
 * To run a mutation, you first call `useLeaveMatchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveMatchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveMatchMutation, { data, loading, error }] = useLeaveMatchMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *   },
 * });
 */
export function useLeaveMatchMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LeaveMatchMutation, LeaveMatchMutationVariables>) {
        return ApolloReactHooks.useMutation<LeaveMatchMutation, LeaveMatchMutationVariables>(LeaveMatchDocument, baseOptions);
      }
export type LeaveMatchMutationHookResult = ReturnType<typeof useLeaveMatchMutation>;
export type LeaveMatchMutationResult = ApolloReactCommon.MutationResult<LeaveMatchMutation>;
export type LeaveMatchMutationOptions = ApolloReactCommon.BaseMutationOptions<LeaveMatchMutation, LeaveMatchMutationVariables>;
export const PlayCardDocument = gql`
    mutation playCard($matchId: ID!, $cardId: ID!) {
  playCard(matchId: $matchId, cardId: $cardId) {
    myCards {
      id
      card
      played
    }
    cardsPlayedByPlayer {
      playerId
      cards
    }
  }
}
    `;
export type PlayCardMutationFn = ApolloReactCommon.MutationFunction<PlayCardMutation, PlayCardMutationVariables>;

/**
 * __usePlayCardMutation__
 *
 * To run a mutation, you first call `usePlayCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlayCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [playCardMutation, { data, loading, error }] = usePlayCardMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *      cardId: // value for 'cardId'
 *   },
 * });
 */
export function usePlayCardMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PlayCardMutation, PlayCardMutationVariables>) {
        return ApolloReactHooks.useMutation<PlayCardMutation, PlayCardMutationVariables>(PlayCardDocument, baseOptions);
      }
export type PlayCardMutationHookResult = ReturnType<typeof usePlayCardMutation>;
export type PlayCardMutationResult = ApolloReactCommon.MutationResult<PlayCardMutation>;
export type PlayCardMutationOptions = ApolloReactCommon.BaseMutationOptions<PlayCardMutation, PlayCardMutationVariables>;
export const FetchMatchesDocument = gql`
    query fetchMatches {
  matches {
    id
    playersCount
    points
    creator {
      name
      avatar
    }
    players {
      name
      avatar
    }
  }
}
    `;

/**
 * __useFetchMatchesQuery__
 *
 * To run a query within a React component, call `useFetchMatchesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchMatchesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchMatchesQuery({
 *   variables: {
 *   },
 * });
 */
export function useFetchMatchesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FetchMatchesQuery, FetchMatchesQueryVariables>) {
        return ApolloReactHooks.useQuery<FetchMatchesQuery, FetchMatchesQueryVariables>(FetchMatchesDocument, baseOptions);
      }
export function useFetchMatchesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FetchMatchesQuery, FetchMatchesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<FetchMatchesQuery, FetchMatchesQueryVariables>(FetchMatchesDocument, baseOptions);
        }
export type FetchMatchesQueryHookResult = ReturnType<typeof useFetchMatchesQuery>;
export type FetchMatchesLazyQueryHookResult = ReturnType<typeof useFetchMatchesLazyQuery>;
export type FetchMatchesQueryResult = ApolloReactCommon.QueryResult<FetchMatchesQuery, FetchMatchesQueryVariables>;
export const SubscribeNewMatchesDocument = gql`
    subscription SubscribeNewMatches {
  matchListUpdated {
    type
    id
    playersCount
    points
    creator {
      name
      avatar
    }
    players {
      name
      avatar
    }
  }
}
    `;

/**
 * __useSubscribeNewMatchesSubscription__
 *
 * To run a query within a React component, call `useSubscribeNewMatchesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeNewMatchesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscribeNewMatchesSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSubscribeNewMatchesSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<SubscribeNewMatchesSubscription, SubscribeNewMatchesSubscriptionVariables>) {
        return ApolloReactHooks.useSubscription<SubscribeNewMatchesSubscription, SubscribeNewMatchesSubscriptionVariables>(SubscribeNewMatchesDocument, baseOptions);
      }
export type SubscribeNewMatchesSubscriptionHookResult = ReturnType<typeof useSubscribeNewMatchesSubscription>;
export type SubscribeNewMatchesSubscriptionResult = ApolloReactCommon.SubscriptionResult<SubscribeNewMatchesSubscription>;
export const CreateMatchDocument = gql`
    mutation createMatch($playersCount: Int!, $points: Int!) {
  createMatch(playersCount: $playersCount, points: $points) {
    id
  }
}
    `;
export type CreateMatchMutationFn = ApolloReactCommon.MutationFunction<CreateMatchMutation, CreateMatchMutationVariables>;

/**
 * __useCreateMatchMutation__
 *
 * To run a mutation, you first call `useCreateMatchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMatchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMatchMutation, { data, loading, error }] = useCreateMatchMutation({
 *   variables: {
 *      playersCount: // value for 'playersCount'
 *      points: // value for 'points'
 *   },
 * });
 */
export function useCreateMatchMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMatchMutation, CreateMatchMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateMatchMutation, CreateMatchMutationVariables>(CreateMatchDocument, baseOptions);
      }
export type CreateMatchMutationHookResult = ReturnType<typeof useCreateMatchMutation>;
export type CreateMatchMutationResult = ApolloReactCommon.MutationResult<CreateMatchMutation>;
export type CreateMatchMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateMatchMutation, CreateMatchMutationVariables>;

