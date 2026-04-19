-- VIEW get all active artikels (TODO: bakal diubah jadi untuk suggestion di homepage)
CREATE OR REPLACE VIEW v_artikel_kards AS
SELECT
  a.id,
  a.title,
  a.slug,
  a.source_type,
  a.short_description,
  a.is_published,
  a.created_at,
  a.updated_at,
  a.tags,
  json_build_object(
    'id', s.id,
    'mal_id', s.mal_id,
    'title', s.title,
    'title_en', s.title_en,
    'title_ja', s.title_ja,
    'image_url', s.image_url,
    'source_type', s.source_type,
    'media_type', s.media_type,
    'season', s.season,
    'month', s.month,
    'year', s.year,
    'genres', s.genres,
    'studios', s.studios,
    'author_name', s.author_name,
    'mal_score', s.mal_score,
    'mal_rank', s.mal_rank,
    'created_at', s.created_at,
    'updated_at', s.updated_at
  ) AS source
FROM articles a
LEFT JOIN sources s ON a.source_id = s.id
WHERE a.is_published = true
ORDER BY a.created_at, a.updated_at
LIMIT 10;

-- VIEW get all active artikels 
CREATE OR REPLACE VIEW v_active_artikel_kards AS
SELECT
  a.id,
  a.title,
  a.slug,
  a.source_type,
  a.short_description,
  a.is_published,
  a.created_at,
  a.updated_at,
  a.tags,
  json_build_object(
    'id', s.id,
    'mal_id', s.mal_id,
    'title', s.title,
    'title_en', s.title_en,
    'title_ja', s.title_ja,
    'image_url', s.image_url,
    'source_type', s.source_type,
    'media_type', s.media_type,
    'season', s.season,
    'month', s.month,
    'year', s.year,
    'genres', s.genres,
    'studios', s.studios,
    'author_name', s.author_name,
    'mal_score', s.mal_score,
    'mal_rank', s.mal_rank,
    'created_at', s.created_at,
    'updated_at', s.updated_at
  ) AS source
FROM articles a
LEFT JOIN sources s ON a.source_id = s.id
WHERE a.is_published = true;

-- VIEW get all deleted artikels 
CREATE OR REPLACE VIEW v_deleted_artikel_kards AS
SELECT
  a.id,
  a.title,
  a.slug,
  a.source_type,
  a.short_description,
  a.is_published,
  a.created_at,
  a.updated_at,
  a.tags,
  json_build_object(
    'id', s.id,
    'mal_id', s.mal_id,
    'title', s.title,
    'title_en', s.title_en,
    'title_ja', s.title_ja,
    'image_url', s.image_url,
    'source_type', s.source_type,
    'media_type', s.media_type,
    'season', s.season,
    'month', s.month,
    'year', s.year,
    'genres', s.genres,
    'studios', s.studios,
    'author_name', s.author_name,
    'mal_score', s.mal_score,
    'mal_rank', s.mal_rank,
    'created_at', s.created_at,
    'updated_at', s.updated_at
  ) AS source
FROM articles a
LEFT JOIN sources s ON a.source_id = s.id
WHERE a.is_published = false;

-- VIEW get all artikels 
CREATE OR REPLACE VIEW v_all_artikel_kards AS
SELECT
  a.id,
  a.title,
  a.slug,
  a.source_type,
  a.short_description,
  a.is_published,
  a.created_at,
  a.updated_at,
  a.tags,
  json_build_object(
    'id', s.id,
    'mal_id', s.mal_id,
    'title', s.title,
    'title_en', s.title_en,
    'title_ja', s.title_ja,
    'image_url', s.image_url,
    'source_type', s.source_type,
    'media_type', s.media_type,
    'season', s.season,
    'month', s.month,
    'year', s.year,
    'genres', s.genres,
    'studios', s.studios,
    'author_name', s.author_name,
    'mal_score', s.mal_score,
    'mal_rank', s.mal_rank,
    'created_at', s.created_at,
    'updated_at', s.updated_at
  ) AS source
FROM articles a
LEFT JOIN sources s ON a.source_id = s.id

-- VIEW get artikel by endpoint [.../source_type/slug]
CREATE OR REPLACE VIEW v_artikel_detail AS
SELECT
  a.id,
  a.title,
  a.slug,
  a.source_type,
  s.id AS source_id,
  a.short_description,
  a.content_html,
  a.content_json,
  a.is_published,
  a.created_at,
  a.updated_at,
  a.tags,
  -- reviewer object
  json_build_object(
    'id', u.id,
    'name', u.name
  ) AS reviewer,
  -- source object
  json_build_object(
    'id', s.id,
    'mal_id', s.mal_id,
    'title', s.title,
    'title_ja', s.title_ja,
    'title_en', s.title_en,
    'image_url', s.image_url,
    'source_type', s.source_type,
    'media_type', s.media_type,
    'season', s.season,
    'month', s.month,
    'year', s.year,
    'genres', s.genres,
    'studios', s.studios,
    'author_name', s.author_name,
    'mal_score', s.mal_score,
    'mal_rank', s.mal_rank,
    'created_at', s.created_at,
    'updated_at', s.updated_at
  ) AS source,
  -- rating array
  (
    SELECT COALESCE(
      json_agg(
        json_build_object(
          'id', rb.id,
          'artikel_id', rb.artikel_id,
          'name', rb.name,
          'value', rb.value
        )
        ORDER BY rb.id
      ),
      '[]'::json
    )
    FROM rating_breakdowns rb
    WHERE rb.artikel_id = a.id
  ) AS rating_breakdown
FROM articles a
LEFT JOIN users u ON a.reviewer_id = u.id
LEFT JOIN sources s ON a.source_id = s.id;

-- ALTER make unique source_type x slug combination
ALTER TABLE articles
ADD CONSTRAINT unique_slug_source_type UNIQUE (slug, source_type);

ALTER table sources
ADD CONSTRAINT unique_source_type_mal_id unique (source_type, mal_id);

-- INDEXING source_type x skug
CREATE INDEX idx_articles_slug_source_type
ON articles(slug, source_type);

drop view v_artikel_kards;
drop view v_active_artikel_kards;
drop view v_deleted_artikel_kards;
drop view v_all_artikel_kards;

notify pgrst, 'reload schema';


-- FUNCTION upsert artikel include the source
create or replace function create_artikel_full(payload jsonb)
returns jsonb
language plpgsql
as $$
declare
    v_source_id uuid;
    v_artikel_id uuid;
    v_is_update boolean;
begin
    -- UPSERT SOURCE (sama seperti sebelumnya)
    insert into sources (
        mal_id, title, title_en, title_ja,
        image_url, source_type, media_type,
        season, month, year,
        genres, studios, author_name,
        mal_score, mal_rank
    )
    values (
        (payload->'source'->>'mal_id')::bigint,
        payload->'source'->>'title',
        payload->'source'->>'title_en',
        payload->'source'->>'title_ja',
        payload->'source'->>'image_url',
        payload->>'source_type',
        payload->'source'->>'media_type',
        payload->'source'->>'season',
        payload->'source'->>'month',
        (payload->'source'->>'year')::bigint,
        array(select jsonb_array_elements_text(payload->'source'->'genres')),
        array(select jsonb_array_elements_text(payload->'source'->'studios')),
        array(select jsonb_array_elements_text(payload->'source'->'author_name')),
        (payload->'source'->>'mal_score')::float,
        (payload->'source'->>'mal_rank')::bigint
    )
    on conflict (source_type, mal_id)
    do update set
        title        = excluded.title,
        title_en     = excluded.title_en,
        title_ja     = excluded.title_ja,
        image_url    = excluded.image_url,
        media_type   = excluded.media_type,
        season       = excluded.season,
        month        = excluded.month,
        year         = excluded.year,
        genres       = excluded.genres,
        studios      = excluded.studios,
        author_name  = excluded.author_name,
        mal_score    = excluded.mal_score,
        mal_rank     = excluded.mal_rank,
        updated_at   = now()
    returning id into v_source_id;
    -- INSERT atau UPDATE ARTIKEL
    -- if ada payload->>'artikel_id' -> UPDATE
    -- if tidak ada -> INSERT
    v_is_update := (payload->>'artikel_id') is not null;
    if v_is_update then
        v_artikel_id := (payload->>'artikel_id')::uuid;
        if exists (
            select 1 from articles
            where source_type = payload->>'source_type'
              and slug = payload->>'slug'
              and id != v_artikel_id
        ) then
            raise exception 'Slug sudah digunakan';
        end if;
        update articles set
            title             = payload->>'title',
            slug              = payload->>'slug',
            short_description = payload->>'short_description',
            content_html      = payload->>'content_html',
            content_json      = payload->'content_json',
            is_published      = (payload->>'is_published')::boolean,
            source_id         = v_source_id,
            tags              = array(select jsonb_array_elements_text(payload->'tags')),
            source_type       = payload->>'source_type',
            updated_at        = now()
        where id = v_artikel_id;
        -- pastikan artikel ditemukan
        if not found then
            raise exception 'Artikel dengan id % tidak ditemukan', v_artikel_id;
        end if;
        -- hapus rating lama lalu insert ulang yang baru
        delete from rating_breakdowns where artikel_id = v_artikel_id;
    else
        insert into articles (
            title, slug, short_description,
            content_html, content_json,
            is_published, reviewer_id,
            source_id, tags, source_type
        )
        values (
            payload->>'title',
            payload->>'slug',
            payload->>'short_description',
            payload->>'content_html',
            payload->'content_json',
            (payload->>'is_published')::boolean,
            (payload->>'reviewer_id')::uuid,
            v_source_id,
            array(select jsonb_array_elements_text(payload->'tags')),
            payload->>'source_type'
        )
        returning id into v_artikel_id;
    end if;
    -- INSERT RATING BREAKDOWN
    -- mode update: data lama sudah didelete di atas
    insert into rating_breakdowns (artikel_id, name, value)
    select
        v_artikel_id,
        item->>'name',
        item->>'value'
    from jsonb_array_elements(payload->'review_breakdown') as item;
    -- RETURN
    return jsonb_build_object(
        'artikel_id', v_artikel_id,
        'slug',       payload->>'slug',
        'is_update',  v_is_update
    );
end;
$$;

drop function if exists create_artikel_full;

notify pgrst, 'reload schema';


-- FUNCTION delete artikel & turunan & (kondisional) source nya
create or replace function delete_artikel_with_cleanup(
    p_source_type text,
    p_slug text
)
returns void
language plpgsql
as $$
declare
    v_article_id uuid;
    v_source_id uuid;
    v_article_count int;
begin
    -- Ambil artikel
    select id, source_id
    into v_article_id, v_source_id
    from articles
    where slug = p_slug
      and source_type = p_source_type;
    if v_article_id is null then
        raise exception 'Artikel not found';
    end if;
    -- Hapus artikel (rating_breakdowns auto ikut kehapus)
    delete from articles
    where id = v_article_id;
    -- Cek apakah source masih dipakai
    select count(*)
    into v_article_count
    from articles
    where source_id = v_source_id;
    -- Kalau tidak dipakai -> hapus source
    if v_article_count = 0 then
        delete from sources
        where id = v_source_id;
    end if;
end;
$$;

drop function if exists delete_artikel_with_cleanup;
notify pgrst, 'reload schema';

-- FUNCTION get data for dashboard
create or replace function get_dashboard_data()
returns json
language sql
as $$
select json_build_object(

  -- total active articles
  'total_active_article',
  (select count(*) from articles where is_published = true),

  -- total all articles
  'total_all_article',
  (select count(*) from articles),

  -- statistik per bulan
  'statistic_article_created',
  (
    select json_agg(
      json_build_object(
        'label', to_char(months.month, 'FMMon YYYY'),
        'value', coalesce(counts.total, 0)
      )
      order by months.month
    )
    from (
      -- generate 12 bulan terakhir (termasuk bulan sekarang)
      select generate_series(
        date_trunc('month', now()) - interval '11 months',
        date_trunc('month', now()),
        interval '1 month'
      ) as month
    ) months
    left join (
      -- data asli dari articles
      select date_trunc('month', created_at) as month,
            count(*) as total
      from articles
      group by 1
    ) counts
    on months.month = counts.month
  ),
  'statistic_article_updated',
  (
    select json_agg(
      json_build_object(
        'label', to_char(months.month, 'FMMon YYYY'),
        'value', coalesce(counts.total, 0)
      )
      order by months.month
    )
    from (
      select generate_series(
        date_trunc('month', now()) - interval '11 months',
        date_trunc('month', now()),
        interval '1 month'
      ) as month
    ) months
    left join (
      select date_trunc('month', updated_at) as month,
            count(*) as total
      from articles
      where updated_at is distinct from created_at
        and updated_at >= date_trunc('month', now()) - interval '11 months'
      group by 1
    ) counts
    on months.month = counts.month
  ),

  -- total created bulan ini
  'this_month_created',
  (
    select count(*)
    from articles
    where date_trunc('month', created_at) = date_trunc('month', now())
  ),
  -- total updated bulan ini
  'this_month_updated',
  (
    select count(*)
    from articles
    where updated_at is distinct from created_at
      and date_trunc('month', updated_at) = date_trunc('month', now())
  ),

  -- recent created
  'recent_created_articles',
  (
    select json_agg(row_to_json(t))
    from (
      select *
      from v_active_artikel_kards
      order by created_at desc
      limit 5
    ) t
  ),

  -- recent updated
  'recent_updated_articles',
  (
    select json_agg(row_to_json(t))
    from (
      select *
      from v_active_artikel_kards
      order by updated_at desc
      limit 5
    ) t
  )

);
$$;