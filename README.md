# Trail People

## Table of Contents
1. [Description](#description)
1. [Project Progress](#project-progress)
2. [Screenshots](#screenshots)
3. [Tech Stack](#tech-stack)
4. [Models](#models)
5. [API Endpoints](#api-endpoints)
6. [Integrations](#integrations)
7. [License](#license)

## Description

Trail People is a platform designed for trail runners, providing a social media experience where users can connect, share, and explore their passion for trail running. Features include:

- **Social Media Platform**: Users can post updates, comment on posts, and like content shared by other users. The platform includes search and filter functionality for discovering and exploring content within the social media feed.

- **Trail Map Creation and Sharing**: Trail People allows users to create, share, and save trail maps for their favorite trail runs. This feature enables runners to discover new trails, plan their runs, and share their experiences with others.

Trail People aims to provide a comprehensive platform where the trail running
community can meet and engage!


## Project Progress

Trail People is a work in progress and is currently my main focus. This project will consolidate and build upon the full-stack skills showcased in my earlier projects, and will be a comprehensive demonstration of my capabilities.

## Screenshots

Coming soon!

## Tech Stack

### Frontend:
- **JavaScript**
- **React**
- **Google Maps JavaScript API**

### Backend:
- **Python**
- **Django**

### DevOps:
- **Heroku** (for backend deployment)
- **Netlify** (for frontend deployment)

### Version Control:
- **Git**
- **GitHub**

## Models

This project consists of the following data models divided into three Django apps: accounts, activities, and content. Each app contains models representing different aspects of the Trail People project.

### Accounts

#### CustomUser

| Field            | Type          |
|------------------|---------------|
| id               | PrimaryKey    |
| bio              | TextField     |
| profile_picture  | ImageField    |

### Activities

#### Trail

| Field          | Type                   |
|----------------|------------------------|
| id             | PrimaryKey             |
| creator        | ForeignKey(CustomUser) |
| name           | CharField              |
| description    | TextField              |
| image          | ImageField             |
| coordinates    | JSONField              |
| created_at     | DateTimeField          |
| updated_at     | DateTimeField          |

#### Race

| Field          | Type                   |
|----------------|------------------------|
| id             | PrimaryKey             |
| creator        | ForeignKey(CustomUser) |
| name           | CharField              |
| description    | TextField              |
| link           | URLField               |
| image          | ImageField             |
| created_at     | DateTimeField          |
| updated_at     | DateTimeField          |

#### UserTrail

| Field  | Type                          |
|--------|-------------------------------|
| id     | PrimaryKey                    |
| user   | ForeignKey(CustomUser)        |
| trail  | ForeignKey(Trail)             |

#### UserRace

| Field  | Type                          |
|--------|-------------------------------|
| id     | PrimaryKey                    |
| user   | ForeignKey(CustomUser)        |
| race   | ForeignKey(Race)              |

### Content

#### Tag

| Field  | Type          |
|--------|---------------|
| id     | PrimaryKey    |
| name   | CharField     |

#### Post

| Field          | Type                    |
|----------------|-------------------------|
| id             | PrimaryKey              |
| author         | ForeignKey(CustomUser)  |
| tags           | ManyToManyField(Tag)    |
| title          | CharField               |
| content        | TextField               |
| image          | ImageField              |
| created_at     | DateTimeField           |
| updated_at     | DateTimeField           |
| status         | CharField               |

#### Comment

| Field          | Type                    |
|----------------|-------------------------|
| id             | PrimaryKey              |
| author         | ForeignKey(CustomUser)  |
| post           | ForeignKey(Post)        |
| content        | TextField               |
| image          | ImageField (Optional)   |
| created_at     | DateTimeField           |
| updated_at     | DateTimeField           |

#### PostLike

| Field          | Type                    |
|----------------|-------------------------|
| id             | PrimaryKey              |
| author         | ForeignKey(CustomUser)  |
| post           | ForeignKey(Post)        |
| created_at     | DateTimeField           |

#### CommentLike

| Field          | Type                    |
|----------------|-------------------------|
| id             | PrimaryKey              |
| author         | ForeignKey(CustomUser)  |
| comment        | ForeignKey(Comment)     |
| created_at     | DateTimeField           |

## API Endpoints
Coming soon!

## Integrations

### Google Maps JavaScript API

The Trail People project integrates the Google Maps JavaScript API to enable interactive map functionalities. This integration allows users to:

- **Map Interaction:** Users can click on the map to place markers, indicating the starting point of new trails.
- **Map Visualization:** The API provides a visually appealing map interface for users to view and interact with.

## License
This project is licensed under the [Apache License 2.0](./LICENSE). See the [LICENSE](./LICENSE) file for details.
