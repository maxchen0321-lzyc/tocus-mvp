create unique index if not exists collections_user_topic_unique
  on collections (user_id, topic_id)
  where user_id is not null;

create unique index if not exists collections_anonymous_topic_unique
  on collections (anonymous_id, topic_id)
  where user_id is null;
