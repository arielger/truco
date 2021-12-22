import gql from 'graphql-tag';
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
  __typename?: 'Action';
  playerId: Scalars['ID'];
  type: Scalars['String'];
  points?: Maybe<Scalars['Int']>;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  token: Scalars['String'];
  user: User;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type Card = {
  __typename?: 'Card';
  id: Scalars['ID'];
  card: Scalars['String'];
  played: Scalars['Boolean'];
};

export type CardsByPlayer = {
  __typename?: 'cardsByPlayer';
  playerId: Scalars['ID'];
  cards?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Envido = {
  __typename?: 'Envido';
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
  __typename?: 'Match';
  id: Scalars['ID'];
  status: MatchStatus;
  playersCount: Scalars['Int'];
  points: Scalars['Int'];
  creator: Player;
  players: Array<Maybe<Player>>;
};

export type MatchListUpdate = {
  __typename?: 'MatchListUpdate';
  type?: Maybe<MatchListUpdateType>;
  id: Scalars['ID'];
  status: MatchStatus;
  playersCount: Scalars['Int'];
  points: Scalars['Int'];
  creator: Player;
  players: Array<Maybe<Player>>;
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
  __typename?: 'MatchUpdate';
  type?: Maybe<MatchUpdateType>;
  id: Scalars['ID'];
  status: MatchStatus;
  playersCount: Scalars['Int'];
  points: Scalars['Int'];
  creator: Player;
  players: Array<Maybe<Player>>;
  myCards?: Maybe<Array<Card>>;
  nextPlayer?: Maybe<Scalars['ID']>;
  isLastPlayerFromTeam?: Maybe<Scalars['Boolean']>;
  cardsPlayedByPlayer?: Maybe<Array<CardsByPlayer>>;
  roundWinnerTeam?: Maybe<Team>;
  matchWinnerTeam?: Maybe<Team>;
  myPoints?: Maybe<Scalars['Int']>;
  theirPoints?: Maybe<Scalars['Int']>;
  truco?: Maybe<Truco>;
  envido?: Maybe<Envido>;
  nextPlayerEnvido?: Maybe<Scalars['ID']>;
  envidoPoints?: Maybe<Array<Maybe<PlayerEnvidoPoints>>>;
  lastAction?: Maybe<Action>;
};

export type MatchUpdateResponse = {
  __typename?: 'MatchUpdateResponse';
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
  __typename?: 'Mutation';
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
  __typename?: 'Player';
  id: Scalars['ID'];
  name: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
  isFromFirstTeam: Scalars['Boolean'];
};

export type PlayerEnvidoPoints = {
  __typename?: 'playerEnvidoPoints';
  playerId: Scalars['ID'];
  moveType: SayEnvidoMoveType;
  team: Team;
  points?: Maybe<Scalars['Int']>;
};

export type PlayerMatch = {
  __typename?: 'PlayerMatch';
  id: Scalars['ID'];
  status: MatchStatus;
  playersCount: Scalars['Int'];
  points: Scalars['Int'];
  creator: Player;
  players: Array<Maybe<Player>>;
  myCards: Array<Card>;
  nextPlayer?: Maybe<Scalars['ID']>;
  isLastPlayerFromTeam?: Maybe<Scalars['Boolean']>;
  cardsPlayedByPlayer: Array<CardsByPlayer>;
  roundWinnerTeam?: Maybe<Team>;
  matchWinnerTeam?: Maybe<Team>;
  myPoints?: Maybe<Scalars['Int']>;
  theirPoints?: Maybe<Scalars['Int']>;
  truco?: Maybe<Truco>;
  envido?: Maybe<Envido>;
  nextPlayerEnvido?: Maybe<Scalars['ID']>;
  envidoPoints?: Maybe<Array<Maybe<PlayerEnvidoPoints>>>;
  lastAction?: Maybe<Action>;
};

/**
 * There should be at lest one field in each type
 * https://github.com/graphql/graphql-js/issues/937
 */
export type Query = {
  __typename?: 'Query';
  _?: Maybe<Scalars['Boolean']>;
  user: User;
  matches: Array<Maybe<Match>>;
  match?: Maybe<PlayerMatch>;
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
  __typename?: 'Subscription';
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
  __typename?: 'Truco';
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
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
};


