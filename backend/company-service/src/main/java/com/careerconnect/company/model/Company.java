package com.careerconnect.company.model;

import jakarta.persistence.*;

@Entity
@Table(name = "companies")
public class Company {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String ownerId; // UUID map to EMPLOYER user
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String website;
    private String logoUrl;
    private String industry;
    private String location;
    private String phone;
    private String email;
    private String ceoName;
    private String hrName;
    
    @Column(columnDefinition = "TEXT")
    private String branches;
    
    @Column(columnDefinition = "TEXT")
    private String staffNames;
    
    @Column(columnDefinition = "TEXT")
    private String socialMediaLinks;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getCeoName() { return ceoName; }
    public void setCeoName(String ceoName) { this.ceoName = ceoName; }
    
    public String getHrName() { return hrName; }
    public void setHrName(String hrName) { this.hrName = hrName; }
    
    public String getBranches() { return branches; }
    public void setBranches(String branches) { this.branches = branches; }
    
    public String getStaffNames() { return staffNames; }
    public void setStaffNames(String staffNames) { this.staffNames = staffNames; }
    
    public String getSocialMediaLinks() { return socialMediaLinks; }
    public void setSocialMediaLinks(String socialMediaLinks) { this.socialMediaLinks = socialMediaLinks; }
}
