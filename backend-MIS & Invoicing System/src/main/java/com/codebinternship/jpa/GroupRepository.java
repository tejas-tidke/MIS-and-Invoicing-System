package com.codebinternship.jpa;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codebinternship.entity.Group;

public interface GroupRepository extends JpaRepository<Group, Long> {
	Optional<Group> findByName(String name);
	List<Group> findByIsActive(boolean isActive);

}