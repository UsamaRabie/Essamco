const SiteContent = require('../models/SiteContent');

/**
 * @desc    Get site content (homepage sections, hero, institutional, private label, retail, why choose us, CTA, footer, brands, seo)
 * @route   GET /api/site-content
 * @access  Public
 */
exports.getSiteContent = async (req, res, next) => {
  try {
    let content = await SiteContent.findOne({ key: 'homepage' });

    if (!content) {
      // Seed default
      content = await SiteContent.create({ key: 'homepage' });
    } else {
      // Ensure newly added sections exist if document was created with older schema
      let modified = false;

      // Ensure heroSlides exists with at least 4 slides
      if (!content.heroSlides || content.heroSlides.length === 0) {
        content.heroSlides = [
          {
            id: 'slide-1',
            badge: 'Certified Chemical Excellence',
            badgeAr: 'تميز كيميائي معتمد',
            title: content.hero?.title || 'Quality you can certify.\nSupply you can count on.',
            titleAr: content.hero?.titleAr || 'جودة يمكنك توثيقها.\nإمداد يمكنك الاعتماد عليه.',
            subtitle: content.hero?.subtitle || 'Industrial detergents and disinfectants, engineered to ISO standards — from formulation to production line.',
            subtitleAr: content.hero?.subtitleAr || 'المنظفات والمطهرات الصناعية، مصممة وفقاً لمعايير الآيزو - من التركيبة إلى خط الإنتاج.',
            image: content.hero?.image || '/images/showcase/hero_scientist_clean.png',
            primaryBtnText: content.hero?.primaryBtnText || 'Explore Our Products',
            primaryBtnTextAr: content.hero?.primaryBtnTextAr || 'استكشف منتجاتنا',
            primaryBtnLink: 'products',
            secondaryBtnText: content.hero?.secondaryBtnText || 'Request a Quote',
            secondaryBtnTextAr: content.hero?.secondaryBtnTextAr || 'طلب عرض سعر',
            secondaryBtnLink: 'quote',
          },
          {
            id: 'slide-2',
            badge: 'Healthcare & Hospital Bio-Security',
            badgeAr: 'الأمان الحيوي للمستشفيات والمنشآت الصحية',
            title: 'Medical-Grade Disinfection.\nMaximum Bio-Security.',
            titleAr: 'تطهير طبي معتمد.\nأعلى درجات الأمان الحيوي.',
            subtitle: 'Certified quaternary and hospital disinfectants trusted by top healthcare facilities and institutions across Egypt.',
            subtitleAr: 'مطهرات كواترناري ومحاليل تعقيم طبية معتمدة تثق بها كبرى المستشفيات والمنشآت الصحية في مصر.',
            image: '/images/categories/hospital.jpg',
            primaryBtnText: 'Institutional Solutions',
            primaryBtnTextAr: 'الحلول المؤسسية',
            primaryBtnLink: 'institutional',
            secondaryBtnText: 'Request Quotation',
            secondaryBtnTextAr: 'طلب تسعير جملة',
            secondaryBtnLink: 'quote',
          },
          {
            id: 'slide-3',
            badge: 'Heavy Industry & Fleet Operations',
            badgeAr: 'الصناعات الثقيلة وأساطيل النقل',
            title: 'Heavy-Duty Chemical Power.\nUncompromising Performance.',
            titleAr: 'قوة كيميائية فائقة للصناعات الشاقة.\nأداء بلا مساومة.',
            subtitle: 'Specialized engine degreasers, high-foam snow car shampoos, and industrial scale removers for heavy operations.',
            subtitleAr: 'مزيلات شحوم المحركات، شامبوهات رغوية فائقة للسيارات، ومذيبات ترسبات صناعية للمصانع والورش الكبرى.',
            image: '/images/categories/car-care.jpg',
            primaryBtnText: 'Explore Heavy Formulations',
            primaryBtnTextAr: 'استكشف المنظفات الشاقة',
            primaryBtnLink: 'products',
            secondaryBtnText: 'Custom Formulation',
            secondaryBtnTextAr: 'طلب عينة خاصة',
            secondaryBtnLink: 'quote',
          },
          {
            id: 'slide-4',
            badge: 'Turnkey Contract Manufacturing',
            badgeAr: 'تصنيع كيميائي وتعبئة لحساب الغير',
            title: 'Your Brand, Powered by\nEssamco Chemical Engineering.',
            titleAr: 'علامتك التجارية بقوة\nالهندسة الكيميائية من عصامكو.',
            subtitle: 'Turnkey private-label manufacturing, custom formulation, ISO-certified bottling, and regulatory licensing support.',
            subtitleAr: 'تصنيع شامل لحساب الغير، تركيبات كيميائية مخصصة، تعبئة بمعايير الآيزو ودعم كامل للتراخيص والمطابقة.',
            image: '/images/showcase/branding_manufacturing.png',
            primaryBtnText: 'Private Label Services',
            primaryBtnTextAr: 'خدمات التصنيع للغير',
            primaryBtnLink: 'private-label',
            secondaryBtnText: 'Partner With Us',
            secondaryBtnTextAr: 'شراكة التصنيع',
            secondaryBtnLink: 'quote',
          },
        ];
        modified = true;
      }

      // Check if institutional cards need enriched slugs/descriptions
      if (content.institutional?.cards && content.institutional.cards.length > 0) {
        let needsEnrich = false;
        content.institutional.cards.forEach((c, i) => {
          if (!c.slug) {
            c.slug = i === 0 ? 'bulk-contracts' : i === 1 ? 'custom-packaging' : i === 2 ? 'safety-sheets' : `institutional-${i + 1}`;
            needsEnrich = true;
          }
          if (!c.images || c.images.length === 0) {
            c.images = [c.image, '/images/facilities/warehouse.jpg', '/images/facilities/factory-tanks.jpg'].filter(Boolean);
            needsEnrich = true;
          }
          if (!c.description) {
            c.description = c.title + ' engineered to the highest industrial and institutional chemical standards.';
            c.descriptionAr = (c.titleAr || c.title) + ' مصممة وفقاً لأعلى معايير الجودة الكيميائية المؤسسية والصناعية.';
            needsEnrich = true;
          }
        });
        if (needsEnrich) {
          content.markModified('institutional');
          modified = true;
        }
      }

      // Check if private label cards need enriched slugs/descriptions
      if (content.privateLabel?.cards && content.privateLabel.cards.length > 0) {
        let needsEnrich = false;
        content.privateLabel.cards.forEach((c, i) => {
          if (!c.slug) {
            c.slug = i === 0 ? 'custom-formulation' : i === 1 ? 'branding-manufacturing' : i === 2 ? 'min-order-quantities' : `private-label-${i + 1}`;
            needsEnrich = true;
          }
          if (!c.images || c.images.length === 0) {
            c.images = [c.image, '/images/facilities/lab-beakers.jpg', '/images/facilities/factory-tanks.jpg'].filter(Boolean);
            needsEnrich = true;
          }
          if (!c.description) {
            c.description = c.title + ' custom contract manufacturing and private-label formulation service.';
            c.descriptionAr = (c.titleAr || c.title) + ' خدمة تصنيع وتعبئة مخصصة لحساب الغير بأعلى المعايير.';
            needsEnrich = true;
          }
        });
        if (needsEnrich) {
          content.markModified('privateLabel');
          modified = true;
        }
      }

      // Check if retail cards need enriched slugs
      if (content.retail?.cards && content.retail.cards.length > 0) {
        let needsEnrich = false;
        content.retail.cards.forEach((c, i) => {
          if (!c.slug) {
            c.slug = i === 0 ? 'retail-laundry' : i === 1 ? 'retail-surface' : i === 2 ? 'retail-disinfection' : i === 3 ? 'retail-soap-noodles' : `retail-${i + 1}`;
            needsEnrich = true;
          }
          if (!c.images || c.images.length === 0) {
            c.images = [c.image, '/images/products/laundry-detergent.jpg'].filter(Boolean);
            needsEnrich = true;
          }
        });
        if (needsEnrich) {
          content.markModified('retail');
          modified = true;
        }
      }

      if (content.retail === undefined || content.retail === null) {
        content.retail = undefined; // trigger default schema
        modified = true;
      }
      if (content.whyChooseUs === undefined || content.whyChooseUs === null) {
        content.whyChooseUs = undefined;
        modified = true;
      }
      if (content.brands === undefined || content.brands === null) {
        content.brands = undefined;
        modified = true;
      }
      if (!content.seo || !content.seo.metaTitle) {
        content.seo = undefined;
        modified = true;
      }
      if (!content.stats?.metrics) {
        if (!content.stats) content.stats = {};
        content.stats.metrics = [
          { value: content.stats.founded || '1997', label: content.stats.foundedLabel || 'Founded', labelAr: content.stats.foundedLabelAr || 'سنة التأسيس' },
          { value: content.stats.years || '+25', label: content.stats.yearsLabel || 'Years', labelAr: content.stats.yearsLabelAr || 'عاماً' },
          { value: content.stats.categories || '7', label: content.stats.categoriesLabel || 'Categories', labelAr: content.stats.categoriesLabelAr || 'تصنيفات' },
        ];
        modified = true;
      }
      if (!content.partnershipCta) {
        content.partnershipCta = undefined;
        modified = true;
      }
      if (!content.footerSettings) {
        content.footerSettings = undefined;
        modified = true;
      }
      if (!content.socialLinks) {
        content.socialLinks = {
          facebook: 'https://facebook.com',
          twitter: 'https://twitter.com',
          linkedin: 'https://linkedin.com',
          instagram: 'https://instagram.com',
          whatsapp: '+201000000000',
          youtube: '',
          tiktok: '',
        };
        modified = true;
      }
      if (modified) {
        await content.save();
      }
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update site content
 * @route   PUT /api/site-content
 * @access  Private (Admin / SuperAdmin)
 */
exports.updateSiteContent = async (req, res, next) => {
  try {
    const { hero, heroSlides, stats, institutional, privateLabel, retail, whyChooseUs, brands, partnershipCta, footerSettings, socialLinks, seo } = req.body;

    let content = await SiteContent.findOne({ key: 'homepage' });

    if (!content) {
      content = new SiteContent({ key: 'homepage' });
    }

    if (hero) {
      content.hero = { ...content.hero?.toObject?.() || {}, ...hero };
      content.markModified('hero');
    }

    if (Array.isArray(heroSlides)) {
      content.heroSlides = heroSlides;
      content.markModified('heroSlides');
    }

    if (stats) {
      content.stats = { ...content.stats?.toObject?.() || {}, ...stats };
      if (Array.isArray(stats.metrics)) content.stats.metrics = stats.metrics;
      content.markModified('stats');
    }

    if (institutional) {
      if (!content.institutional) content.institutional = {};
      if (institutional.title !== undefined) content.institutional.title = institutional.title;
      if (institutional.titleAr !== undefined) content.institutional.titleAr = institutional.titleAr;
      if (institutional.subtitle !== undefined) content.institutional.subtitle = institutional.subtitle;
      if (institutional.subtitleAr !== undefined) content.institutional.subtitleAr = institutional.subtitleAr;
      if (Array.isArray(institutional.cards)) content.institutional.cards = institutional.cards;
      content.markModified('institutional');
    }

    if (privateLabel) {
      if (!content.privateLabel) content.privateLabel = {};
      if (privateLabel.title !== undefined) content.privateLabel.title = privateLabel.title;
      if (privateLabel.titleAr !== undefined) content.privateLabel.titleAr = privateLabel.titleAr;
      if (privateLabel.subtitle !== undefined) content.privateLabel.subtitle = privateLabel.subtitle;
      if (privateLabel.subtitleAr !== undefined) content.privateLabel.subtitleAr = privateLabel.subtitleAr;
      if (Array.isArray(privateLabel.cards)) content.privateLabel.cards = privateLabel.cards;
      content.markModified('privateLabel');
    }

    if (retail) {
      if (!content.retail) content.retail = {};
      if (retail.title !== undefined) content.retail.title = retail.title;
      if (retail.titleAr !== undefined) content.retail.titleAr = retail.titleAr;
      if (retail.subtitle !== undefined) content.retail.subtitle = retail.subtitle;
      if (retail.subtitleAr !== undefined) content.retail.subtitleAr = retail.subtitleAr;
      if (retail.btnText !== undefined) content.retail.btnText = retail.btnText;
      if (retail.btnTextAr !== undefined) content.retail.btnTextAr = retail.btnTextAr;
      if (Array.isArray(retail.cards)) content.retail.cards = retail.cards;
      content.markModified('retail');
    }

    if (whyChooseUs) {
      if (!content.whyChooseUs) content.whyChooseUs = {};
      if (whyChooseUs.title !== undefined) content.whyChooseUs.title = whyChooseUs.title;
      if (whyChooseUs.titleAr !== undefined) content.whyChooseUs.titleAr = whyChooseUs.titleAr;
      if (whyChooseUs.subtitle !== undefined) content.whyChooseUs.subtitle = whyChooseUs.subtitle;
      if (whyChooseUs.subtitleAr !== undefined) content.whyChooseUs.subtitleAr = whyChooseUs.subtitleAr;
      if (whyChooseUs.image !== undefined) content.whyChooseUs.image = whyChooseUs.image;
      if (whyChooseUs.btnText !== undefined) content.whyChooseUs.btnText = whyChooseUs.btnText;
      if (whyChooseUs.btnTextAr !== undefined) content.whyChooseUs.btnTextAr = whyChooseUs.btnTextAr;
      if (Array.isArray(whyChooseUs.points)) content.whyChooseUs.points = whyChooseUs.points;
      content.markModified('whyChooseUs');
    }

    if (Array.isArray(brands)) {
      content.brands = brands;
      content.markModified('brands');
    }

    if (partnershipCta) {
      if (!content.partnershipCta) content.partnershipCta = {};
      if (partnershipCta.title !== undefined) content.partnershipCta.title = partnershipCta.title;
      if (partnershipCta.titleAr !== undefined) content.partnershipCta.titleAr = partnershipCta.titleAr;
      if (partnershipCta.subtitle !== undefined) content.partnershipCta.subtitle = partnershipCta.subtitle;
      if (partnershipCta.subtitleAr !== undefined) content.partnershipCta.subtitleAr = partnershipCta.subtitleAr;
      if (partnershipCta.btnText !== undefined) content.partnershipCta.btnText = partnershipCta.btnText;
      if (partnershipCta.btnTextAr !== undefined) content.partnershipCta.btnTextAr = partnershipCta.btnTextAr;
      content.markModified('partnershipCta');
    }

    if (footerSettings) {
      if (!content.footerSettings) content.footerSettings = {};
      if (footerSettings.tagline !== undefined) content.footerSettings.tagline = footerSettings.tagline;
      if (footerSettings.taglineAr !== undefined) content.footerSettings.taglineAr = footerSettings.taglineAr;
      if (footerSettings.newsletterTitle !== undefined) content.footerSettings.newsletterTitle = footerSettings.newsletterTitle;
      if (footerSettings.newsletterTitleAr !== undefined) content.footerSettings.newsletterTitleAr = footerSettings.newsletterTitleAr;
      if (footerSettings.copyright !== undefined) content.footerSettings.copyright = footerSettings.copyright;
      if (footerSettings.copyrightAr !== undefined) content.footerSettings.copyrightAr = footerSettings.copyrightAr;
      content.markModified('footerSettings');
    }

    if (socialLinks) {
      if (!content.socialLinks) content.socialLinks = {};
      if (socialLinks.facebook !== undefined) content.socialLinks.facebook = socialLinks.facebook;
      if (socialLinks.twitter !== undefined) content.socialLinks.twitter = socialLinks.twitter;
      if (socialLinks.linkedin !== undefined) content.socialLinks.linkedin = socialLinks.linkedin;
      if (socialLinks.instagram !== undefined) content.socialLinks.instagram = socialLinks.instagram;
      if (socialLinks.whatsapp !== undefined) content.socialLinks.whatsapp = socialLinks.whatsapp;
      if (socialLinks.youtube !== undefined) content.socialLinks.youtube = socialLinks.youtube;
      if (socialLinks.tiktok !== undefined) content.socialLinks.tiktok = socialLinks.tiktok;
      content.markModified('socialLinks');
    }

    if (seo) {
      if (!content.seo) content.seo = {};
      if (seo.metaTitle !== undefined) content.seo.metaTitle = seo.metaTitle;
      if (seo.metaTitleAr !== undefined) content.seo.metaTitleAr = seo.metaTitleAr;
      if (seo.metaDescription !== undefined) content.seo.metaDescription = seo.metaDescription;
      if (seo.metaDescriptionAr !== undefined) content.seo.metaDescriptionAr = seo.metaDescriptionAr;
      if (seo.keywords !== undefined) content.seo.keywords = seo.keywords;
      if (seo.keywordsAr !== undefined) content.seo.keywordsAr = seo.keywordsAr;
      if (seo.ogImage !== undefined) content.seo.ogImage = seo.ogImage;
      if (seo.canonicalUrl !== undefined) content.seo.canonicalUrl = seo.canonicalUrl;
      if (seo.robotsIndex !== undefined) content.seo.robotsIndex = Boolean(seo.robotsIndex);
      if (seo.robotsFollow !== undefined) content.seo.robotsFollow = Boolean(seo.robotsFollow);
      content.markModified('seo');
    }

    await content.save();

    res.status(200).json({
      success: true,
      message: 'Site content updated successfully',
      data: content,
    });
  } catch (error) {
    next(error);
  }
};
