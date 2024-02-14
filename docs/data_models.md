#### Users

| Field           | Type                     | Unique | Optional |
| --------------- | ------------------------ | ------ | -------- |
| id              | primary key              | yes    | no       |
| username        | string                   | yes    | no       |
| hashed_password | string                   | no     | no       |
| email           | string                   | yes    | no       |
| first_name      | string                   | no     | no       |
| last_name       | string                   | no     | no       |
| bio             | string                   | no     | yes      |
| zip_code        | string                   | no     | no       |
| pic_url         | string                   | no     | yes      |
| created_on      | datetime                 | no     | no       |

#### Posts

| Field        | Type                     | Unique | Optional |
| ------------ | ------------------------ | ------ | -------- |
| id           | primary key              | yes    | no       |
| author_id    | reference to user pk     | no     | no       |
| name         | string                   | no     | no       |
| breed        | string                   | no     | no       |
| age          | INT                      | no     | no       |
| color        | string                   | no     | no       |
| bio          | string                   | no     | no       |
| favorite_toy | string                   | no     | yes      |
| friendly     | BOOLEAN                  | no     | yes      |
| pet_me       | BOOLEAN                  | no     | yes      |
| pic_url      | string                   | no     | yes      |

#### Comments

| Field      | Type                     | Unique | Optional |
| ---------- | ------------------------ | ------ | -------- |
| id         | primary key              | yes    | no       |
| content    | string                   | no     | no       |
| tag        | string                   | no     | yes      |
| created_on | datetime                 | no     | no       |
| author_id  | reference to user pk     | no     | no       |
| pic_url    | string                   | no     | yes      |

#### Likes

| Field       | Type                      | Unique | Optional |
| ----------- | ------------------------- | ------ | -------- |
| id          | primary key               | yes    | no       |
| name        | string                    | no     | no       |
| address     | string                    | no     | no       |
| city        | string                    | no     | no       |
| state       | string                    | no     | no       |
| description | string                    | no     | no       |
| hours       | string                    | no     | no       |
| water       | BOOLEAN                   | no     | yes      |
| bathroom    | BOOLEAN                   | no     | yes      |
| poop_bags   | BOOLEAN                   | no     | yes      |
| pic_url     | string                    | no     | yes      |

#### Races

| Field   | Type                         | Unique | Optional |
| ------- | ---------------------------- | ------ | -------- |
| id      | reference to follower entity | yes    | no       |
| user_id | reference to user entity     | no     | no       |
| park_id | reference to park entity     | no     | no       |

#### Trails

| Field      | Type                        | Unique | Optional |
| ---------- | --------------------------- | ------ | -------- |
| id         | reference to comment entity | yes    | no       |
| content    | string                      | no     | no       |
| created_on | datetime                    | no     | no       |
| author_id  | reference to user entity    | no     | no       |
| post_id    | reference to post entity    | no     | no       |
| pic_url    | string                      | no     | yes      |
